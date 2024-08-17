import request from 'supertest';
import { app, sequelize } from '../express';

describe('E2E test for clients', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a client', async () => {
    const response = await request(app)
      .post('/clients')
      .send({
        name: 'Client 1',
        email: 'client@mail.com',
        document: '123456789',
        address: {
          street: 'Street 1',
          number: '123',
          complement: 'Near the park',
          city: 'City 1',
          state: 'State 1',
          zipCode: '12345678',
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe('Client 1');
    expect(response.body.email).toBe('client@mail.com');
    expect(response.body.document).toBe('123456789');
    expect(response.body.address._street).toBe('Street 1');
    expect(response.body.address._number).toBe('123');
    expect(response.body.address._complement).toBe('Near the park');
    expect(response.body.address._city).toBe('City 1');
    expect(response.body.address._state).toBe('State 1');
    expect(response.body.address._zipCode).toBe('12345678');
  });
});
