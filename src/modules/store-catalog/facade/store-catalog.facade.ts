import FindAllProductsUseCase from '../usecase/find-all-products/find-all-products.usecase';
import FindProductUseCase from '../usecase/find-product/find-product.usecase';
import StoreCatalogFacadeInterface, {
  FindAllSortStoreCatalogFacadeOutputDto,
  FindStoreCatalogFacadeInputDto,
  FindStoreCatalogFacadeOutputDto,
} from './store-catalog.facade.interface';

export interface UseCaseProps {
  findUseCase: FindProductUseCase;
  findAllUseCase: FindAllProductsUseCase;
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private _findUseCase: FindProductUseCase;

  private _findAllUseCase: FindAllProductsUseCase;

  constructor(props: UseCaseProps) {
    this._findUseCase = props.findUseCase;
    this._findAllUseCase = props.findAllUseCase;
  }

  async findById(
    id: FindStoreCatalogFacadeInputDto
  ): Promise<FindStoreCatalogFacadeOutputDto> {
    return await this._findUseCase.execute(id);
  }
  async findAll(): Promise<FindAllSortStoreCatalogFacadeOutputDto> {
    return await this._findAllUseCase.execute();
  }
}
