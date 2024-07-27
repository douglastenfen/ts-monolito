import Product from '../domain/product.entity';

export default interface ProductGateway {
  findAll(): Promise<Product[]>;
  findById(productId: string): Promise<Product>;
}
