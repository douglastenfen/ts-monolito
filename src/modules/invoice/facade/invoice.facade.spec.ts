import { Sequelize } from 'sequelize-typescript';
import InvoiceModel from '../repository/invoice.model';
import InvoiceItemModel from '../repository/invoice-item.model';
import InvoiceFacadeFactory from '../factory/facade.factory';
import { create } from 'yup/lib/Reference';

describe('InvoiceFacade test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should generate an invoice', async () => {
    const facade = InvoiceFacadeFactory.create();

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

    const output = await facade.generate(input);

    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);

    expect(output.street).toEqual(input.street);
    expect(output.number).toEqual(input.number);
    expect(output.complement).toEqual(input.complement);
    expect(output.city).toEqual(input.city);
    expect(output.state).toEqual(input.state);

    expect(output.items).toHaveLength(2);

    expect(output.total).toBe(30);
  });

  it('should find an invoice', async () => {
    const facade = InvoiceFacadeFactory.create();

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

    const invoice = {
      id: '1',
      name: 'any_name',
      document: 'any_document',
      street: 'any_street',
      number: 'any_number',
      complement: 'any_complement',
      city: 'any_city',
      state: 'any_state',
      zipCode: 'any_zip',
      items: invoiceItems,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await InvoiceModel.create(invoice, { include: [InvoiceItemModel] });

    const input = {
      id: '1',
    };

    const output = await facade.findById(input);

    expect(output).toBeDefined();
    expect(output.id).toBe(invoice.id);
    expect(output.name).toBe(invoice.name);
    expect(output.document).toBe(invoice.document);

    expect(output.address.street).toEqual(invoice.street);
    expect(output.address.number).toEqual(invoice.number);
    expect(output.address.complement).toEqual(invoice.complement);
    expect(output.address.city).toEqual(invoice.city);
    expect(output.address.state).toEqual(invoice.state);
    expect(output.address.zipCode).toEqual(invoice.zipCode);

    expect(output.items).toHaveLength(2);
    expect(output.items[0].id).toBe(invoiceItem1.id);
    expect(output.items[0].name).toBe(invoiceItem1.name);
    expect(output.items[0].price).toBe(invoiceItem1.price);
    expect(output.items[1].id).toBe(invoiceItem2.id);
    expect(output.items[1].name).toBe(invoiceItem2.name);
    expect(output.items[1].price).toBe(invoiceItem2.price);

    expect(output.total).toBe(30);

    expect(output.createdAt).toStrictEqual(invoice.createdAt);
  });
});
