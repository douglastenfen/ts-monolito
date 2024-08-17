import Id from '../../../@shared/domain/value-object/id.value-object';
import InvoiceItems from '../../domain/invoice-items.entity';
import Invoice from '../../domain/invoice.entity';
import Address from '../../value-object/address';
import FindInvoiceUseCase from './find-invoice.usecase';

const invoiceItem1 = new InvoiceItems({
  id: new Id(),
  name: 'any_name',
  price: 10,
});

const invoiceItem2 = new InvoiceItems({
  id: new Id(),
  name: 'any_name',
  price: 20,
});

const invoiceItems = [invoiceItem1, invoiceItem2];

const invoice = new Invoice({
  id: new Id(),
  name: 'any_name',
  document: 'any_document',
  address: new Address(
    'any_street',
    'any_number',
    'any_complement',
    'any_city',
    'any_state',
    'any_zip',
  ),
  items: invoiceItems,
});

const MockRepository = () => {
  return {
    findById: jest.fn().mockResolvedValue(invoice),
    generate: jest.fn(),
  };
};

describe('FindInvoiceUsecase unit test', () => {
  it('should find an invoice by id', async () => {
    const invoiceRepository = MockRepository();

    const usecase = new FindInvoiceUseCase(invoiceRepository);

    const input = {
      id: '1',
    };

    const result = await usecase.execute(input);

    expect(invoiceRepository.findById).toHaveBeenCalled();

    expect(result.id).toBe(invoice.id.id);
    expect(result.name).toBe(invoice.name);
    expect(result.document).toBe(invoice.document);

    expect(result.address.street).toBe(invoice.address.street);
    expect(result.address.number).toBe(invoice.address.number);
    expect(result.address.complement).toBe(invoice.address.complement);
    expect(result.address.city).toBe(invoice.address.city);
    expect(result.address.state).toBe(invoice.address.state);
    expect(result.address.zipCode).toBe(invoice.address.zipCode);

    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toBe(invoice.items[0].id.id);
    expect(result.items[0].name).toBe(invoice.items[0].name);
    expect(result.items[0].price).toBe(invoice.items[0].price);
    expect(result.items[1].id).toBe(invoice.items[1].id.id);
    expect(result.items[1].name).toBe(invoice.items[1].name);
    expect(result.items[1].price).toBe(invoice.items[1].price);

    expect(result.createdAt).toBeDefined();
    expect(result.total).toBe(30);
  });
});
