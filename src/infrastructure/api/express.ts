import express, { Express } from 'express';
import { Sequelize } from 'sequelize-typescript';
import ProductModel from '../../domain/modules/product-adm/repository/product.model';
import { productRouter } from '../api/routes/product.route';
import { clientRouter } from './routes/client.route';
import { ClientModel } from '../../domain/modules/client-adm/repository/client.model';
import { checkoutRouter } from './routes/checkout.route';
import { invoiceRoute } from './routes/invoice.route';

export const app: Express = express();

app.use(express.json());

app.use('/products', productRouter);
app.use('/clients', clientRouter);
app.use('/checkout', checkoutRouter);
app.use('/invoices', invoiceRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  });

  sequelize.addModels([ProductModel, ClientModel]);

  await sequelize.sync();
}

setupDb();
