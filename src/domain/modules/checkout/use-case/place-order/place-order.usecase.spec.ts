import Id from '../../../@shared/domain/value-object/id.value-object';
import Product from '../../domain/product.entity';
import { PlaceOrderInputDto } from './place-order.dto';
import PlaceOrderUseCase from './place-order.usecase';

const mockDate = new Date('2021-01-01');

describe('PlaceOrderUseCase unit tests', () => {
  describe('validate products method', () => {
    // @ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();

    it('should throw an error if no products are selected', async () => {
      const input: PlaceOrderInputDto = { clientId: '0', products: [] };

      await expect(
        placeOrderUseCase['validateProducts'](input)
      ).rejects.toThrowError('No products selected');
    });

    it('should throw an error when product is out of stock', async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) =>
          Promise.resolve({
            productId,
            stock: productId === '1' ? 0 : 1,
          })
        ),
      };

      // @ts-expect-error - force set productFacade
      placeOrderUseCase['_productFacade'] = mockProductFacade;

      let input: PlaceOrderInputDto = {
        clientId: '0',
        products: [{ productId: '1' }],
      };

      await expect(
        placeOrderUseCase['validateProducts'](input)
      ).rejects.toThrowError('Product out of stock');

      input = {
        clientId: '0',
        products: [{ productId: '0' }, { productId: '1' }],
      };

      await expect(
        placeOrderUseCase['validateProducts'](input)
      ).rejects.toThrowError('Product out of stock');

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

      input = {
        clientId: '0',
        products: [{ productId: '0' }, { productId: '1' }, { productId: '2' }],
      };

      await expect(
        placeOrderUseCase['validateProducts'](input)
      ).rejects.toThrowError('Product out of stock');

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
    });
  });

  describe('getProducts method', () => {
    beforeAll(() => {
      jest.useFakeTimers('modern');
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    // @ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();

    it('should throw an error when product is not found', async () => {
      const mockCatalogFacade = {
        findById: jest.fn().mockResolvedValue(null),
      };

      // @ts-expect-error - force set catalogFacade
      placeOrderUseCase['_catalogFacade'] = mockCatalogFacade;

      await expect(placeOrderUseCase['getProduct']('0')).rejects.toThrowError(
        'Product not found'
      );
    });

    it('should return a product', async () => {
      const mockCatalogFacade = {
        findById: jest.fn().mockResolvedValue({
          id: '0',
          name: 'Product 0',
          description: 'Description 0',
          salesPrice: 0,
        }),
      };

      //@ts-expect-error - force set catalogFacade
      placeOrderUseCase['_catalogFacade'] = mockCatalogFacade;

      await expect(placeOrderUseCase['getProduct']('0')).resolves.toEqual(
        new Product({
          id: new Id('0'),
          name: 'Product 0',
          description: 'Description 0',
          salesPrice: 0,
        })
      );

      expect(mockCatalogFacade.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('execute method', () => {
    beforeAll(() => {
      jest.useFakeTimers('modern');
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should throw an error when client not found', async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      // @ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase();

      // @ts-expect-error - force set clientFacade
      placeOrderUseCase['_clientFacade'] = mockClientFacade;

      const input: PlaceOrderInputDto = { clientId: '0', products: [] };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrowError(
        'Client not found'
      );
    });

    it('should return an error when products are not valid', async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true),
      };

      // @ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase();

      const mockValidadeProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, 'validateProducts')
        // @ts-expect-error - not return never
        .mockRejectedValue(new Error('No products selected'));

      // @ts-expect-error - force set clientFacade
      placeOrderUseCase['_clientFacade'] = mockClientFacade;

      const input: PlaceOrderInputDto = { clientId: '1', products: [] };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrowError(
        'No products selected'
      );

      expect(mockValidadeProducts).toHaveBeenCalled();
    });

    describe('place an order', () => {
      const clientProps = {
        id: '1',
        name: 'Client 1',
        document: '000.000.000-00',
        email: 'client@user.com',
        address: {
          street: 'Street 1',
          number: '1',
          complement: 'Complement 1',
          city: 'City 1',
          state: 'State 1',
          zipCode: '00000-000',
        },
      };

      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(clientProps),
        add: jest.fn(),
      };

      const mockPaymentFacade = {
        process: jest.fn(),
      };

      const mockCheckoutRepo = {
        addOrder: jest.fn(),
      };

      const mockInvoiceFacade = {
        generate: jest.fn().mockResolvedValue({ id: '1i' }),
      };

      const placeOrderUseCase = new PlaceOrderUseCase(
        mockClientFacade as any,
        null,
        null,
        mockCheckoutRepo as any,
        mockInvoiceFacade as any,
        mockPaymentFacade as any
      );

      const products = {
        '1': new Product({
          id: new Id('1'),
          name: 'Product 1',
          description: 'Description 1',
          salesPrice: 40,
        }),
        '2': new Product({
          id: new Id('2'),
          name: 'Product 2',
          description: 'Description 2',
          salesPrice: 30,
        }),
      };

      const mockValidadeProducts = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, 'validateProducts')
        // @ts-expect-error - spy on private method
        .mockResolvedValue(null);

      const mockGetProduct = jest
        // @ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, 'getProduct')
        // @ts-expect-error - spy on private method
        .mockImplementation((productId: keyof typeof products) => {
          return products[productId];
        });

      it('should not be approved', async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: '1t',
          orderId: '1d',
          amount: 100,
          status: 'error',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const input: PlaceOrderInputDto = {
          clientId: '1c',
          products: [{ productId: '1' }, { productId: '2' }],
        };

        let output = await placeOrderUseCase.execute(input);

        expect(output.invoiceId).toBeNull();
        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual([
          { productId: '1' },
          { productId: '2' },
        ]);
        expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: '1c' });
        expect(mockValidadeProducts).toHaveBeenCalledTimes(1);
        expect(mockValidadeProducts).toHaveBeenCalledWith(input);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledWith({
          orderId: output.id,
          amount: output.total,
        });

        expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
      });

      it('should be approved', async () => {
        mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
          transactionId: '1t',
          orderId: '1o',
          amount: 100,
          status: 'approved',
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        const input: PlaceOrderInputDto = {
          clientId: '1c',
          products: [{ productId: '1' }, { productId: '2' }],
        };

        let output = await placeOrderUseCase.execute(input);

        expect(output.invoiceId).toBe('1i');
        expect(output.total).toBe(70);
        expect(output.products).toStrictEqual([
          { productId: '1' },
          { productId: '2' },
        ]);

        expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
        expect(mockClientFacade.find).toHaveBeenCalledWith({ id: '1c' });
        expect(mockValidadeProducts).toHaveBeenCalledTimes(1);

        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(mockCheckoutRepo.addOrder).toHaveBeenCalledTimes(1);
        expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
        expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
          name: clientProps.name,
          document: clientProps.document,
          street: clientProps.address.street,
          number: clientProps.address.number,
          complement: clientProps.address.complement,
          city: clientProps.address.city,
          state: clientProps.address.state,
          zipCode: clientProps.address.zipCode,
          items: [
            {
              id: products['1'].id.id,
              name: products['1'].name,
              price: products['1'].salesPrice,
            },
            {
              id: products['2'].id.id,
              name: products['2'].name,
              price: products['2'].salesPrice,
            },
          ],
        });
      });
    });
  });
});
