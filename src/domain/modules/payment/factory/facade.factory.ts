import PaymentFacadeInterface from '../facade/facade.interface';
import PaymentFacade from '../facade/payment.facade';
import TransactionRepository from '../repository/transaction.repository';
import ProcessPaymentUseCase from '../use-case/process-payment/process-payments.usecase';

export default class PaymentFacadeFactory {
  static create(): PaymentFacadeInterface {
    const repository = new TransactionRepository();

    const usecase = new ProcessPaymentUseCase(repository);

    const facade = new PaymentFacade(usecase);

    return facade;
  }
}
