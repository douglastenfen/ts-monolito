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
      address: 'any_address',
    };

    const result = await usecase.execute(input);

    expect(repository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe('any_name');
    expect(result.email).toBe('any_email');
    expect(result.address).toBe('any_address');
  });
});
