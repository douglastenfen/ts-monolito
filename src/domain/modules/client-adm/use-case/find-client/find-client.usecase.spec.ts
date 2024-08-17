import Id from '../../../@shared/domain/value-object/id.value-object';
import Address from '../../../invoice/value-object/address';
import Client from '../../domain/client.entity';
import FindClientUsecase from './find-client.usecase';

const client = new Client({
  id: new Id('1'),
  name: 'any_name',
  email: 'any_email',
  document: 'any_document',
  address: new Address(
    'any_address',
    'any_number',
    'any_complement',
    'any_city',
    'any_state',
    'any_zipCode',
  ),
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockResolvedValue(client),
  };
};

describe('FindClientUsecase unit test', () => {
  it('should find a client', async () => {
    const repository = MockRepository();

    const usecase = new FindClientUsecase(repository);

    const input = {
      id: '1',
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(client.id.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.document).toEqual(client.document);
    expect(result.address).toEqual(client.address);
  });
});
