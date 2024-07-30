import { Sequelize } from 'sequelize-typescript';
import { ClientModel } from '../repository/client.model';
import ClientRepository from '../repository/client.repository';
import AddClientUsecase from '../use-case/add-client/add-client.usecase';
import ClientAdmFacade from './client-adm.facade';
import FindClientUsecase from '../use-case/find-client/find-client.usecase';
import ClientAdmFacadeFactory from '../factory/facade.factory';

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
      address: '123 Main St',
    };

    await facade.add(input);

    const client = await ClientModel.findOne({ where: { id: input.id } });

    expect(client).toBeDefined();
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.address).toBe(input.address);
  });

  it('should find a client', async () => {
    const facade = ClientAdmFacadeFactory.create();

    await ClientModel.create({
      id: '1',
      name: 'John Doe',
      email: 'mail@mail.com',
      address: '123 Main St',
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
    expect(client.address).toBe('123 Main St');
  });
});
