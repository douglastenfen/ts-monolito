import AddProductUseCase from './add-product.usecase';

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe('Add product usecase unit tests', () => {
  it('should add a product', async () => {
    const productRepository = MockRepository();
    const usecase = new AddProductUseCase(productRepository);

    const input = {
      name: 'Product 1',
      description: 'Description 1',
      purchasePrice: 10,
      stock: 10,
    };

    const result = await usecase.execute(input);

    expect(productRepository.add).toHaveBeenCalled();
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name', input.name);
    expect(result).toHaveProperty('description', input.description);
    expect(result).toHaveProperty('purchasePrice', input.purchasePrice);
    expect(result).toHaveProperty('stock', input.stock);
  });
});
