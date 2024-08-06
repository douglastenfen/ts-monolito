import Invoice from '../domain/invoice.entity';

export default interface InvoiceGateway {
  findById(invoiceId: string): Promise<Invoice>;
  generate(invoice: Invoice): Promise<void>;
}
