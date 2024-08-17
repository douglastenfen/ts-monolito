import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from '../repository/client.model';
import ClientRepository from '../repository/client.repository';
import AddClientUsecase from '../use-case/add-client/add-client.usecase';
import ClientAdmFacade from './client-adm.facade';
import FindClientUsecase from '../use-case/find-client/find-client.usecase';
import ClientAdmFacadeFactory from '../factory/facade.factory';
import Address from '../../invoice/value-object/address';

describe('ClientAdmFacade test', () => {
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
    const repository = new ClientRepository();

    const addUseCase = new AddClientUsecase(repository);

    const facade = new ClientAdmFacade({
      addUseCase: addUseCase,
      findUseCase: undefined,
    });

    const input = {
      id: '1',
      name: 'John Doe',
      email: 'mail@mail.com',
      document: '000.000.000-00',
      address: new Address(
        '123 Main St',
        '1',
        'Complement',
        'City',
        'State',
        '00000-000'
      ),
    };

    await facade.add(input);

    const client = await ClientModel.findOne({ where: { id: input.id } });

    expect(client).toBeDefined();
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.document).toBe(input.document);
    expect(client.street).toBe(input.address.street);
    expect(client.number).toBe(input.address.number);
    expect(client.complement).toBe(input.address.complement);
    expect(client.city).toBe(input.address.city);
    expect(client.state).toBe(input.address.state);
    expect(client.zipCode).toBe(input.address.zipCode);
  });

  it('should find a client', async () => {
    const facade = ClientAdmFacadeFactory.create();

    await ClientModel.create({
      id: '1',
      name: 'John Doe',
      email: 'mail@mail.com',
      document: '000.000.000-00',
      street: '123 Main St',
      number: '1',
      complement: 'Complement',
      city: 'City',
      state: 'State',
      zipCode: '00000-000',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const input = {
      id: '1',
    };

    const client = await facade.find(input);

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe('John Doe');
    expect(client.email).toBe('mail@mail.com');
    expect(client.document).toBe('000.000.000-00');
    expect(client.address.street).toBe('123 Main St');
    expect(client.address.number).toBe('1');
    expect(client.address.complement).toBe('Complement');
    expect(client.address.city).toBe('City');
    expect(client.address.state).toBe('State');
    expect(client.address.zipCode).toBe('00000-000');
  });
});
