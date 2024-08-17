import express, { Request, Response } from 'express';
import CheckoutRepository from '../../../domain/modules/checkout/repository/checkout.repository';
import PlaceOrderUseCase from '../../../domain/modules/checkout/use-case/place-order/place-order.usecase';
import ClientAdmFacadeFactory from '../../../domain/modules/client-adm/factory/facade.factory';
import InvoiceFacadeFactory from '../../../domain/modules/invoice/factory/facade.factory';
import PaymentFacadeFactory from '../../../domain/modules/payment/factory/facade.factory';
import ProductAdmFacadeFactory from '../../../domain/modules/product-adm/factory/facade.factory';
import StoreCatalogFacadeFactory from '../../../domain/modules/store-catalog/factory/facade.factory';

export const checkoutRouter = express.Router();

checkoutRouter.post('/', async (req: Request, res: Response) => {
  try {
    const clientFacade = ClientAdmFacadeFactory.create();
    const productFacade = ProductAdmFacadeFactory.create();
    const catalogFacade = StoreCatalogFacadeFactory.create();

    const checkoutRepository = new CheckoutRepository();
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();

    const useCase = new PlaceOrderUseCase(
      clientFacade,
      productFacade,
      catalogFacade,
      checkoutRepository,
      invoiceFacade,
      paymentFacade
    );

    const input = {
      clientId: req.body.clientId,
      products: req.body.products,
    };

    const output = await useCase.execute(input);

    res.status(200).send(output);
  } catch (error) {
    res.status(500).send(error);
  }
});
