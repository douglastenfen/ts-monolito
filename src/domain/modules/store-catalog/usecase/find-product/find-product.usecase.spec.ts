import Id from '../../../@shared/domain/value-object/id.value-object';
import Product from '../../domain/product.entity';
import FindProductUseCase from './find-product.usecase';

const product = new Product({
  id: new Id('1'),
  name: 'Product 1',
  description: 'Description of product 1',
  salesPrice: 10,
});

const MockRepository = () => {
  return {
    findAll: jest.fn(),
    findById: jest.fn().mockResolvedValue(product),
  };
};

describe('FindProductUsecase unit test', () => {
  it('should find product by id', async () => {
    const productRepository = MockRepository();

    const usecase = new FindProductUseCase(productRepository);

    const input = {
      id: '1',
    };

    const result = await usecase.execute(input);

    expect(productRepository.findById).toHaveBeenCalled();

    expect(result.id).toBe(product.id.id);
    expect(result.name).toBe(product.name);
    expect(result.description).toBe(product.description);
    expect(result.salesPrice).toBe(product.salesPrice);
  });
});
