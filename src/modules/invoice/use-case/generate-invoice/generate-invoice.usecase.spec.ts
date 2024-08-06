import Id from '../../../@shared/domain/value-object/id.value-object';
import InvoiceItems from '../../domain/invoice-items.entity';
import Invoice from '../../domain/invoice.entity';
import Address from '../../value-object/address';
import GenerateInvoiceUseCase from './generate-invoice.usecase';

const MockRepository = () => {
  return {
    findById: jest.fn(),
    generate: jest.fn(),
  };
};

describe('GenerateInvoiceUseCase unit test', () => {
  it('should generate an invoice', async () => {
    const invoiceRepository = MockRepository();

    const usecase = new GenerateInvoiceUseCase(invoiceRepository);

    const invoiceItem1 = {
      id: 'i1',
      name: 'any_name',
      price: 10,
    };

    const invoiceItem2 = {
      id: 'i2',
      name: 'any_name',
      price: 20,
    };

    const invoiceItems = [invoiceItem1, invoiceItem2];

    const input = {
      name: 'any_name',
      document: 'any_document',
      street: 'any_street',
      number: 'any_number',
      complement: 'any_complement',
      city: 'any_city',
      state: 'any_state',
      zipCode: 'any_zip',
      items: invoiceItems,
    };

    const result = await usecase.execute(input);

    expect(invoiceRepository.generate).toHaveBeenCalled();

    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);

    expect(result.street).toEqual(input.street);
    expect(result.number).toEqual(input.number);
    expect(result.complement).toEqual(input.complement);
    expect(result.city).toEqual(input.city);
    expect(result.state).toEqual(input.state);
    expect(result.zipCode).toEqual(input.zipCode);

    expect(result.items).toHaveLength(2);

    expect(result.total).toBe(30);
  });
});
