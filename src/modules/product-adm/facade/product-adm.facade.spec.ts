import { Sequelize } from 'sequelize-typescript';
import { ProductModel } from '../repository/product.model';
import ProductRepository from '../repository/product.repository';
import AddProductUseCase from '../usecase/add-product/add-product.usecase';
import ProductAdmFacade from './product-adm.facade';
import ProductAdmFacadeFactory from '../factory/facade.factory';

describe('ProductAdmFacade Test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a product', async () => {
    const productAdmFacade = ProductAdmFacadeFactory.create();

    const input = {
      id: '1',
      name: 'Product 1',
      description: 'Description of product 1',
      purchasePrice: 10,
      stock: 10,
    };

    await productAdmFacade.addProduct(input);

    const productDb = await ProductModel.findOne({
      where: { id: input.id },
    });

    expect(productDb.id).toEqual(input.id);
    expect(productDb.name).toEqual(input.name);
    expect(productDb.description).toEqual(input.description);
    expect(productDb.purchasePrice).toEqual(input.purchasePrice);
    expect(productDb.stock).toEqual(input.stock);
  });

  it('should check product stock', async () => {
    const productAdmFacade = ProductAdmFacadeFactory.create();

    const input = {
      id: '1',
      name: 'Product 1',
      description: 'Description of product 1',
      purchasePrice: 10,
      stock: 10,
    };

    await productAdmFacade.addProduct(input);

    const stock = await productAdmFacade.checkStock({ productId: input.id });

    expect(stock.productId).toBe(input.id);
    expect(stock.stock).toBe(input.stock);
  });
});
