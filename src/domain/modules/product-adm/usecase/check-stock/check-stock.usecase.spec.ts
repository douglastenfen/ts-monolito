import Id from '../../../@shared/domain/value-object/id.value-object';
import Product from '../../domain/product.entity';
import CheckStockUseCase from './check-stock.usecase';

const product = new Product({
  id: new Id('1'),
  name: 'Product 1',
  description: 'Description 1',
  purchasePrice: 10,
  stock: 10,
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
  };
};

describe('Check stock usecase unit tests', () => {
  it('should get sotck of a product', async () => {
    const productRepository = MockRepository();
    const usecase = new CheckStockUseCase(productRepository);

    const input = {
      productId: '1',
    };

    const result = await usecase.execute(input);

    expect(productRepository.find).toHaveBeenCalled();

    expect(result).toHaveProperty('productId', product.id.id);
    expect(result).toHaveProperty('stock', product.stock);
  });
});
