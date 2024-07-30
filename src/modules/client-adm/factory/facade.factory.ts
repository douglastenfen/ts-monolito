import ClientAdmFacade from '../facade/client-adm.facade';
import ClientRepository from '../repository/client.repository';
import AddClientUsecase from '../use-case/add-client/add-client.usecase';
import FindClientUsecase from '../use-case/find-client/find-client.usecase';

export default class ClientAdmFacadeFactory {
  static create(): ClientAdmFacade {
    const clientRepository = new ClientRepository();

    const addUseCase = new AddClientUsecase(clientRepository);

    const findUseCase = new FindClientUsecase(clientRepository);

    const facade = new ClientAdmFacade({
      addUseCase,
      findUseCase,
    });

    return facade;
  }
}
