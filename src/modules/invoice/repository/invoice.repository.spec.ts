import { Sequelize } from 'sequelize-typescript';
import InvoiceModel from './invoice.model';
import InvoiceItemModel from './invoice-item.model';
import Id from '../../@shared/domain/value-object/id.value-object';
import Invoice from '../domain/invoice.entity';
import Address from '../value-object/address';
import InvoiceItems from '../domain/invoice-items.entity';
import InvoiceRepository from './invoice.repository';

describe('InvoiceRepository test', () => {
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

  it('should create an invoice', async () => {
    const repository = new InvoiceRepository();

    const invoice = new Invoice({
      id: new Id('1'),
      name: 'any_name',
      document: 'any_document',
      address: new Address({
        street: 'any_street',
        number: 'any_number',
        complement: 'any_complement',
        city: 'any_city',
        state: 'any_state',
        zipCode: 'any_zipCode',
      }),
      items: [
        new InvoiceItems({
          id: new Id('1'),
          name: 'any_name',
          price: 10,
        }),
        new InvoiceItems({
          id: new Id('2'),
          name: 'any_name',
          price: 20,
        }),
      ],
    });

    await repository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: invoice.id.id },
      include: [InvoiceItemModel],
    });

    expect(invoiceDb.id).toEqual(invoice.id.id);
    expect(invoiceDb.name).toEqual(invoice.name);
    expect(invoiceDb.document).toEqual(invoice.document);
    expect(invoiceDb.street).toEqual(invoice.address.street);
    expect(invoiceDb.number).toEqual(invoice.address.number);
    expect(invoiceDb.complement).toEqual(invoice.address.complement);
    expect(invoiceDb.city).toEqual(invoice.address.city);
    expect(invoiceDb.state).toEqual(invoice.address.state);
    expect(invoiceDb.zipCode).toEqual(invoice.address.zipCode);

    expect(invoiceDb.items.length).toEqual(2);
    expect(invoiceDb.items[0].id).toEqual(invoice.items[0].id.id);
    expect(invoiceDb.items[0].name).toEqual(invoice.items[0].name);
    expect(invoiceDb.items[0].price).toEqual(invoice.items[0].price);
    expect(invoiceDb.items[1].id).toEqual(invoice.items[1].id.id);
    expect(invoiceDb.items[1].name).toEqual(invoice.items[1].name);
    expect(invoiceDb.items[1].price).toEqual(invoice.items[1].price);
  });

  it('should find an invoice', async () => {
    const invoice = await InvoiceModel.create(
      {
        id: '1',
        name: 'any_name',
        document: 'any_document',
        street: 'any_street',
        number: 'any_number',
        complement: 'any_complement',
        city: 'any_city',
        state: 'any_state',
        zipCode: 'any_zipCode',
        items: [
          {
            id: '1',
            name: 'any_name',
            price: 10,
          },
          {
            id: '2',
            name: 'any_name',
            price: 20,
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { include: [{ model: InvoiceItemModel }] }
    );

    const repository = new InvoiceRepository();

    const invoiceFound = await repository.findById(invoice.id);

    expect(invoiceFound.id.id).toEqual(invoice.id);
    expect(invoiceFound.name).toEqual(invoice.name);
    expect(invoiceFound.document).toEqual(invoice.document);
    expect(invoiceFound.address.street).toEqual(invoice.street);
    expect(invoiceFound.address.number).toEqual(invoice.number);
    expect(invoiceFound.address.complement).toEqual(invoice.complement);
    expect(invoiceFound.address.city).toEqual(invoice.city);
    expect(invoiceFound.address.state).toEqual(invoice.state);
    expect(invoiceFound.address.zipCode).toEqual(invoice.zipCode);

    expect(invoiceFound.items.length).toEqual(2);
    expect(invoiceFound.items[0].id.id).toEqual(invoice.items[0].id);
    expect(invoiceFound.items[0].name).toEqual(invoice.items[0].name);
    expect(invoiceFound.items[0].price).toEqual(invoice.items[0].price);
    expect(invoiceFound.items[1].id.id).toEqual(invoice.items[1].id);
    expect(invoiceFound.items[1].name).toEqual(invoice.items[1].name);
    expect(invoiceFound.items[1].price).toEqual(invoice.items[1].price);

    expect(invoiceFound.createdAt).toEqual(invoice.createdAt);
    expect(invoiceFound.updatedAt).toEqual(invoice.updatedAt);
  });
});
