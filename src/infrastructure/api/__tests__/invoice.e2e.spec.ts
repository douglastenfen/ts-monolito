import request from 'supertest';
import { Sequelize } from 'sequelize-typescript';
import InvoiceModel from '../../../domain/modules/invoice/repository/invoice.model';
import InvoiceItemModel from '../../../domain/modules/invoice/repository/invoice-item.model';
import { app } from '../express';

describe('E2E test for invoices', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should get an invoice', async () => {
    const response = await request(app)
      .post('/invoices')
      .send({
        name: 'Invoice 1',
        document: '12345678901',
        street: 'Street 1',
        number: '123',
        complement: 'Complement 1',
        city: 'City 1',
        state: 'State 1',
        zipCode: '12345678',
        items: [
          {
            id: '1',
            name: 'Product 1',
            price: 10,
          },
          {
            id: '2',
            name: 'Product 2',
            price: 20,
          },
        ],
      });

    expect(response.status).toBe(200);

    const invoice = response.body;

    expect(invoice.id).toBeDefined();
    expect(invoice.name).toBe('Invoice 1');
    expect(invoice.document).toBe('12345678901');
    expect(invoice.street).toBe('Street 1');
    expect(invoice.number).toBe('123');
    expect(invoice.complement).toBe('Complement 1');
    expect(invoice.city).toBe('City 1');
    expect(invoice.state).toBe('State 1');
    expect(invoice.zipCode).toBe('12345678');
    expect(invoice.items).toHaveLength(2);
    expect(invoice.items[0].id).toBeDefined();
    expect(invoice.items[0].name).toBe('Product 1');
    expect(invoice.items[0].price).toBe(10);
    expect(invoice.items[1].id).toBeDefined();
    expect(invoice.items[1].name).toBe('Product 2');
    expect(invoice.items[1].price).toBe(20);
    expect(invoice.total).toBe(30);

    const responseGet = await request(app).get(`/invoices/${invoice.id}`);

    expect(responseGet.status).toBe(200);

    const invoiceGet = responseGet.body;

    expect(invoiceGet.id).toBe(invoice.id);
    expect(invoiceGet.name).toBe(invoice.name);
    expect(invoiceGet.document).toBe(invoice.document);
    expect(invoiceGet.address.street).toBe(invoice.street);
    expect(invoiceGet.address.number).toBe(invoice.number);
    expect(invoiceGet.address.complement).toBe(invoice.complement);
    expect(invoiceGet.address.city).toBe(invoice.city);
    expect(invoiceGet.address.state).toBe(invoice.state);
    expect(invoiceGet.address.zipCode).toBe(invoice.zipCode);
    expect(invoiceGet.items).toHaveLength(2);
    expect(invoiceGet.items[0].id).toBe(invoice.items[0].id);
    expect(invoiceGet.items[0].name).toBe(invoice.items[0].name);
    expect(invoiceGet.items[0].price).toBe(invoice.items[0].price);
    expect(invoiceGet.items[1].id).toBe(invoice.items[1].id);
    expect(invoiceGet.items[1].name).toBe(invoice.items[1].name);
    expect(invoiceGet.items[1].price).toBe(invoice.items[1].price);
    expect(invoiceGet.total).toBe(invoice.total);
  });
});
