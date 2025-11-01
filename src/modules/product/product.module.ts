import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductHttpController } from './commands/create-product/create-product.http.controller';
import { CreateProductService } from './commands/create-product/create-product.service';
import { PrismaProductRepository } from './database/product.repository';
import { FindAllProductsHttpController } from './queries/find-products/find-products.http.controller';
import { FindProductsService } from './queries/find-products/find-products.service';
import { FindProductService } from './queries/find-product/find-product.service';
import { FindProductByIdHttpController } from './queries/find-product/find-product.http.controller';
import { EditProductService } from './commands/update-product/update-product.service';
import { EditProductByIdHttpController } from './commands/update-product/update-product.http.controller';
import { RemoveProductByIdHttpController } from './commands/remove-product/remove-product.http.controller';
import { RemoveProductService } from './commands/remove-product/remove-product.service';
import { CreateProductCategoryHttpController } from './commands/create-product-category/create-product-category.http.controller';
import { CreateProductCategoryService } from './commands/create-product-category/create-product-category.service';
import { FileUploadModule } from '../files-upload/file-upload.module';
import { FindAllAdminProductsHttpController } from './queries/find-all-products-admin/find-all-products-admin.http.controller';
import { FindAllProductsAdminService } from './queries/find-all-products-admin/find-all-products-admin.service';
import { UpdateProductCategoryHttpController } from './commands/update-product-category/update-product-category.http.controller';
import { UpdateProductCategoryService } from './commands/update-product-category/update-product-category.service';
import { FindProductCategoryByIdHttpController } from './queries/show-single-product-category/show-single-product-category.http.controller';
import { FindProductCategoryService } from './queries/show-single-product-category/show-single-product-category.service';
import { FindAllCategoriesProductService } from './queries/show-product-category/show-product-category.service';
import { FindCategoryProductHttpController } from './queries/show-product-category/show-product-category.http.controller';

const httpControllers = [
  CreateProductHttpController,
  FindAllProductsHttpController,
  FindProductByIdHttpController,
  EditProductByIdHttpController,
  RemoveProductByIdHttpController,
  CreateProductCategoryHttpController,
  FindCategoryProductHttpController,
  FindAllAdminProductsHttpController,
  UpdateProductCategoryHttpController,
  FindProductCategoryByIdHttpController,
];

const commandHandlers: Provider[] = [
  CreateProductService,
  EditProductService,
  RemoveProductService,
  CreateProductCategoryService,
  UpdateProductCategoryService,
];

const queryHandlers: Provider[] = [
  FindProductsService,
  FindProductService,
  FindAllCategoriesProductService,
  FindAllProductsAdminService,
  FindProductCategoryService,
];

const repositories: Provider[] = [PrismaProductRepository];

@Module({
  imports: [CqrsModule, FileUploadModule],
  controllers: [...httpControllers],
  providers: [Logger, ...repositories, ...commandHandlers, ...queryHandlers],
})
export class ProductModule {}
