import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from './client.model';
import Id from '../../@shared/domain/value-object/id.value-object';
import Client from '../domain/client.entity';
import ClientRepository from './client.repository';

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
      address: 'any_address',
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
    expect(clientProps.address).toEqual(clientDb.address);
    expect(client.createdAt).toStrictEqual(clientDb.createdAt);
    expect(client.updatedAt).toStrictEqual(clientDb.updatedAt);
  });

  it('should find a client', async () => {
    const clientRepository = new ClientRepository();

    await ClientModel.create({
      id: '1',
      name: 'any_name',
      email: 'any_email',
      address: 'any_address',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const client = await clientRepository.find('1');

    expect(client.id.id).toEqual(client.id.id);
    expect(client.name).toEqual(client.name);
    expect(client.email).toEqual(client.email);
    expect(client.address).toEqual(client.address);
    expect(client.createdAt).toStrictEqual(client.createdAt);
    expect(client.updatedAt).toStrictEqual(client.updatedAt);
  });
});
