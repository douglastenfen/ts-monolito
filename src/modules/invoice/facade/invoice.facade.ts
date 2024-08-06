import UseCaseInterface from '../../@shared/usecase/usecase.interface';
import InvoiceFacadeInterface, {
  FindInvoiceFacadeInputDTO,
  FindInvoiceFacadeOutputDTO,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
} from './facade.interface';

export interface UseCaseProps {
  generateInvoiceUseCase: UseCaseInterface;
  findByIdInvoiceUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateInvoiceUseCase: UseCaseInterface;

  private _findByIdInvoiceUseCase: UseCaseInterface;

  constructor(private generateInvoiceUseCase: UseCaseProps) {
    this._generateInvoiceUseCase =
      generateInvoiceUseCase.generateInvoiceUseCase;

    this._findByIdInvoiceUseCase =
      generateInvoiceUseCase.findByIdInvoiceUseCase;
  }

  generate(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    return this._generateInvoiceUseCase.execute(input);
  }
  findById(
    input: FindInvoiceFacadeInputDTO
  ): Promise<FindInvoiceFacadeOutputDTO> {
    return this._findByIdInvoiceUseCase.execute(input);
  }
}
