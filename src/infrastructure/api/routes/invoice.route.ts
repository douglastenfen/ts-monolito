import express, { Request, Response } from 'express';
import InvoiceRepository from '../../../domain/modules/invoice/repository/invoice.repository';
import GenerateInvoiceUseCase from '../../../domain/modules/invoice/use-case/generate-invoice/generate-invoice.usecase';
import FindInvoiceUseCase from '../../../domain/modules/invoice/use-case/find-invoice/find-invoice.usecase';

export const invoiceRoute = express.Router();

invoiceRoute.post('/', async (req: Request, res: Response) => {
  try {
    const useCase = new GenerateInvoiceUseCase(new InvoiceRepository());

    const invoiceDto = {
      name: req.body.name,
      document: req.body.document,
      street: req.body.street,
      number: req.body.number,
      complement: req.body.complement,
      city: req.body.city,
      state: req.body.state,
      zipCode: req.body.zipCode,
      items: req.body.items,
    };

    const output = await useCase.execute(invoiceDto);

    res.status(200).send(output);
  } catch (error) {
    res.status(500).send(error);
  }
});

invoiceRoute.get('/:id', async (req: Request, res: Response) => {
  try {
    const useCase = new FindInvoiceUseCase(new InvoiceRepository());

    const output = await useCase.execute({ id: req.params.id });

    res.status(200).send(output);
  } catch (error) {
    res.status(500).send(error);
  }
});
