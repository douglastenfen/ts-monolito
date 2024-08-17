import request from 'supertest';
import { app, sequelize } from '../express';

describe('E2E test for products', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should create a product', async () => {
    const response = await request(app).post('/products').send({
      name: 'Product 1',
      description: 'Description of product 1',
      purchasePrice: 10,
      stock: 10,
    });

    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe('Product 1');
    expect(response.body.description).toBe('Description of product 1');
    expect(response.body.purchasePrice).toBe(10);
    expect(response.body.stock).toBe(10);
  });
});
