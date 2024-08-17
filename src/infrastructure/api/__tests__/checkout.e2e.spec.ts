import { Sequelize } from 'sequelize-typescript';
import ClientModel, {
  default as OrderClientModel,
} from '../../../domain/modules/checkout/repository/client.model';
import OrderModel from '../../../domain/modules/checkout/repository/order.model';
import ProductModel from '../../../domain/modules/checkout/repository/product.model';
import InvoiceItemModel from '../../../domain/modules/invoice/repository/invoice-item.model';
import InvoiceModel from '../../../domain/modules/invoice/repository/invoice.model';
import TransactionModel from '../../../domain/modules/payment/repository/transaction.model';
import { default as ProductAdmModel } from '../../../domain/modules/product-adm/repository/product.model';
import { default as StoreProductModel } from '../../../domain/modules/store-catalog/repository/product.model';

describe('E2E test for checkout', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      ProductModel,
      OrderModel,
      ClientModel,
      OrderClientModel,
      TransactionModel,
      ProductAdmModel,
      StoreProductModel,
      InvoiceModel,
      InvoiceItemModel,
    ]);

    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should place an order', async () => {})
});
