import Id from '../../../@shared/domain/value-object/id.value-object';
import Product from '../../domain/product.entity';
import FindAllProductsUseCase from './find-all-products.usecase';

const product = new Product({
  id: new Id('1'),
  name: 'Product 1',
  description: 'Description of product 1',
  salesPrice: 10,
});

const product2 = new Product({
  id: new Id('2'),
  name: 'Product 2',
  description: 'Description of product 2',
  salesPrice: 20,
});

const MockRepository = () => {
  return {
    findAll: jest.fn().mockResolvedValue([product, product2]),
    findById: jest.fn(),
  };
};

describe('FindAllProductsUsecase Unit Test', () => {
  it('should find all products', async () => {
    const productRepository = MockRepository();
    const usecase = new FindAllProductsUseCase(productRepository);

    const result = await usecase.execute();

    expect(productRepository.findAll).toHaveBeenCalled();

    expect(result.products.length).toBe(2);
    expect(result.products[0].id).toBe(product.id.id);
    expect(result.products[0].name).toBe(product.name);
    expect(result.products[0].description).toBe(product.description);
    expect(result.products[0].salesPrice).toBe(product.salesPrice);

    expect(result.products[1].id).toBe(product2.id.id);
    expect(result.products[1].name).toBe(product2.name);
    expect(result.products[1].description).toBe(product2.description);
    expect(result.products[1].salesPrice).toBe(product2.salesPrice);
  });
});
