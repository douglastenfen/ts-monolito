import UseCaseInterface from '../../@shared/usecase/usecase.interface';
import ProductAdmFacadeInterface, {
  AddProductFacadeInputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from './product-adm.facade.interface';

export interface UseCasesProps {
  addProductUseCase: UseCaseInterface;
  checkStockUseCase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  private _addProductUseCase: UseCaseInterface;

  private _checkStockUseCase: UseCaseInterface;

  constructor(usecasesProps: UseCasesProps) {
    this._addProductUseCase = usecasesProps.addProductUseCase;
    this._checkStockUseCase = usecasesProps.checkStockUseCase;
  }

  addProduct(input: AddProductFacadeInputDto): Promise<void> {
    return this._addProductUseCase.execute(input);
  }

  checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    return this._checkStockUseCase.execute(input);
  }
}
