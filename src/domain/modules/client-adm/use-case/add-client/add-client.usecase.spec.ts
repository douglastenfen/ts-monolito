import Address from '../../../invoice/value-object/address';
import AddClientUsecase from './add-client.usecase';

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe('AddClientUsecase unit test', () => {
  it('should add a client', async () => {
    const repository = MockRepository();

    const usecase = new AddClientUsecase(repository);

    const input = {
      name: 'any_name',
      email: 'any_email',
      document: 'any_document',
      address: new Address(
        'any_street',
        'any_number',
        'any_complement',
        'any_city',
        'any_state',
        'any_zipCode'
      ),
    };

    const result = await usecase.execute(input);

    expect(repository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.email).toEqual(input.email);
    expect(result.document).toEqual(input.document);
    expect(result.address).toEqual(input.address);
  });
});
