import express, { Request, Response } from 'express';
import AddClientUsecase from '../../../domain/modules/client-adm/use-case/add-client/add-client.usecase';
import ClientRepository from '../../../domain/modules/client-adm/repository/client.repository';
import Address from '../../../domain/modules/invoice/value-object/address';

export const clientRouter = express.Router();

clientRouter.post('/', async (req: Request, res: Response) => {
  const useCase = new AddClientUsecase(new ClientRepository());

  try {
    const clientDto = {
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: new Address(
        req.body.address.street,
        req.body.address.number,
        req.body.address.complement,
        req.body.address.city,
        req.body.address.state,
        req.body.address.zipCode
      ),
    };

    const output = await useCase.execute(clientDto);

    res.status(200).send(output);
  } catch (error) {
    res.status(500).send(error);
  }
});
