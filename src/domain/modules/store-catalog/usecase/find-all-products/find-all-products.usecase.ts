import UseCaseInterface from '../../../@shared/usecase/usecase.interface';
import ProductGateway from '../../gateway/product.gateway';

export default class FindAllProductsUseCase implements UseCaseInterface {
  private _productRepository: ProductGateway;

  constructor(_productRepository: ProductGateway) {
    this._productRepository = _productRepository;
  }
  async execute(): Promise<any> {
    const products = await this._productRepository.findAll();

    return {
      products: products.map((product) => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
    };
  }
}
