import InvoiceFacade from '../facade/invoice.facade';
import InvoiceRepository from '../repository/invoice.repository';
import FindInvoiceUseCase from '../use-case/find-invoice/find-invoice.usecase';
import GenerateInvoiceUseCase from '../use-case/generate-invoice/generate-invoice.usecase';

export default class InvoiceFacadeFactory {
  static create(): InvoiceFacade {
    const invoiceRepository = new InvoiceRepository();

    const generateInvoiceUseCase = new GenerateInvoiceUseCase(
      invoiceRepository
    );

    const findByIdInvoiceUseCase = new FindInvoiceUseCase(invoiceRepository);

    const facade = new InvoiceFacade({
      generateInvoiceUseCase,
      findByIdInvoiceUseCase,
    });

    return facade;
  }
}
