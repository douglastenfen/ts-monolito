import Id from '../../@shared/domain/value-object/id.value-object';
import InvoiceItems from '../domain/invoice-items.entity';
import Invoice from '../domain/invoice.entity';
import InvoiceGateway from '../gateway/invoice.gateway';
import Address from '../value-object/address';
import InvoiceItemModel from './invoice-item.model';
import InvoiceModel from './invoice.model';

export default class InvoiceRepository implements InvoiceGateway {
  async findById(invoiceId: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id: invoiceId },
      include: [{ model: InvoiceItemModel }],
    });

    if (!invoice) {
      throw new Error(`Invoice with id ${invoiceId} not found`);
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address(
        invoice.street,
        invoice.number,
        invoice.complement,
        invoice.city,
        invoice.state,
        invoice.zipCode
      ),
      items: invoice.items.map(
        (item) =>
          new InvoiceItems({
            id: new Id(item.id),
            name: item.name,
            price: item.price,
          })
      ),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    });
  }

  async generate(invoice: Invoice): Promise<void> {
    await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        state: invoice.address.state,
        city: invoice.address.city,
        zipCode: invoice.address.zipCode,
        items: invoice.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price,
        })),
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      },
      {
        include: [{ model: InvoiceItemModel }],
      }
    );
  }
}
