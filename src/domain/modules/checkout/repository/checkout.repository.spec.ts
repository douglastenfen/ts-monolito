import { Sequelize } from 'sequelize-typescript';
import OrderModel from './order.model';
import ClientModel from './client.model';
import ProductModel from './product.model';
import Id from '../../@shared/domain/value-object/id.value-object';
import Client from '../domain/client.entity';
import Product from '../domain/product.entity';
import Order from '../domain/order.entity';
import CheckoutRepository from './checkout.repository';

describe('CheckoutRepository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([OrderModel, ClientModel, ProductModel]);

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a order', async () => {
    const orderPrors = {
      id: new Id('1'),
      client: new Client({
        id: new Id('1'),
        name: 'Client 1',
        email: 'client@mail.com',
        address: 'Client address',
      }),
      products: [
        new Product({
          id: new Id('1'),
          name: 'Product 1',
          description: 'Description of product 1',
          salesPrice: 10,
        }),
        new Product({
          id: new Id('2'),
          name: 'Product 2',
          description: 'Description of product 2',
          salesPrice: 20,
        }),
      ],
      status: 'pedding',
    };

    const order = new Order(orderPrors);

    const checkoutRepository = new CheckoutRepository();
    await checkoutRepository.addOrder(order);

    const checkoutDb = await OrderModel.findOne({
      where: { id: orderPrors.id.id },
      include: [ClientModel, ProductModel],
    });

    expect(orderPrors.id.id).toBe(checkoutDb.id);
    expect(orderPrors.client.id.id).toBe(checkoutDb.client.id);
    expect(orderPrors.client.name).toBe(checkoutDb.client.name);
    expect(orderPrors.client.email).toBe(checkoutDb.client.email);
    expect(orderPrors.client.address).toBe(checkoutDb.client.address);
    expect(orderPrors.products[0].id.id).toBe(checkoutDb.products[0].id);
    expect(orderPrors.products[0].name).toBe(checkoutDb.products[0].name);
    expect(orderPrors.products[0].description).toBe(
      checkoutDb.products[0].description
    );
    expect(orderPrors.products[0].salesPrice).toBe(
      checkoutDb.products[0].salesPrice
    );
    expect(orderPrors.products[1].id.id).toBe(checkoutDb.products[1].id);
    expect(orderPrors.products[1].name).toBe(checkoutDb.products[1].name);
    expect(orderPrors.products[1].description).toBe(
      checkoutDb.products[1].description
    );
    expect(orderPrors.products[1].salesPrice).toBe(
      checkoutDb.products[1].salesPrice
    );
    expect(orderPrors.status).toBe(checkoutDb.status);
  });
});
