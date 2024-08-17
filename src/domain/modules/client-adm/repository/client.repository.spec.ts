import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from './client.model';
import Id from '../../@shared/domain/value-object/id.value-object';
import Client from '../domain/client.entity';
import ClientRepository from './client.repository';
import Address from '../../invoice/value-object/address';

describe('ClientRepository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ClientModel]);

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a client', async () => {
    const clientProps = {
      id: new Id('1'),
      name: 'any_name',
      email: 'any_email',
      document: 'any_document',
      address: new Address(
        'any_street',
        'any_number',
        'any_complement',
        'any_city',
        'any_state',
        'any_zipCode'
      ),
    };

    const client = new Client(clientProps);

    const clientRepository = new ClientRepository();

    await clientRepository.add(client);

    const clientDb = await ClientModel.findOne({
      where: { id: client.id.id },
    });

    expect(clientDb).toBeDefined();
    expect(clientProps.id.id).toEqual(clientDb.id);
    expect(clientProps.name).toEqual(clientDb.name);
    expect(clientProps.email).toEqual(clientDb.email);
    expect(clientProps.document).toEqual(clientDb.document);
    expect(clientProps.address.street).toEqual(clientDb.street);
    expect(clientProps.address.number).toEqual(clientDb.number);
    expect(clientProps.address.complement).toEqual(clientDb.complement);
    expect(clientProps.address.city).toEqual(clientDb.city);
    expect(clientProps.address.state).toEqual(clientDb.state);
    expect(clientProps.address.zipCode).toEqual(clientDb.zipCode);
  });

  it('should find a client', async () => {
    const clientRepository = new ClientRepository();

    await ClientModel.create({
      id: '1',
      name: 'any_name',
      email: 'any_email',
      document: 'any_document',
      street: 'any_street',
      number: 'any_number',
      complement: 'any_complement',
      city: 'any_city',
      state: 'any_state',
      zipCode: 'any_zipCode',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const client = await clientRepository.find('1');

    expect(client.id.id).toBe('1');
    expect(client.name).toBe('any_name');
    expect(client.email).toBe('any_email');
    expect(client.document).toBe('any_document');
    expect(client.address.street).toBe('any_street');
    expect(client.address.number).toBe('any_number');
    expect(client.address.complement).toBe('any_complement');
    expect(client.address.city).toBe('any_city');
    expect(client.address.state).toBe('any_state');
    expect(client.address.zipCode).toBe('any_zipCode');
  });
});
