import express, { Request, Response } from 'express';
import AddProductUseCase from '../../../domain/modules/product-adm/usecase/add-product/add-product.usecase';
import ProductRepository from '../../../domain/modules/product-adm/repository/product.repository';

export const productRouter = express.Router();

productRouter.post('/', async (req: Request, res: Response) => {
  const useCase = new AddProductUseCase(new ProductRepository());

  try {
    const productDto = {
      name: req.body.name,
      description: req.body.description,
      purchasePrice: req.body.purchasePrice,
      stock: req.body.stock,
    };

    const output = await useCase.execute(productDto);

    res.status(200).send(output);
  } catch (error) {
    res.status(500).send(error);
  }
});
