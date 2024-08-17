export interface FindStoreCatalogFacadeInputDto {
  id: string;
}

export interface FindStoreCatalogFacadeOutputDto {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
}

export interface FindAllSortStoreCatalogFacadeOutputDto {
  products: {
    id: string;
    name: string;
    description: string;
    salesPrice: number;
  }[];
}

export default interface StoreCatalogFacadeInterface {
  findById(
    id: FindStoreCatalogFacadeInputDto
  ): Promise<FindStoreCatalogFacadeOutputDto>;

  findAll(): Promise<FindAllSortStoreCatalogFacadeOutputDto>;
}
