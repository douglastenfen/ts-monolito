import Id from '../../../@shared/domain/value-object/id.value-object';
import Client from '../../domain/client.entity';
import FindClientUsecase from './find-client.usecase';

const client = new Client({
  id: new Id('1'),
  name: 'any_name',
  email: 'any_email',
  address: 'any_address',
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
    expect(result.id).toBe('1');
    expect(result.name).toBe('any_name');
    expect(result.email).toBe('any_email');
    expect(result.address).toBe('any_address');
  });
});
