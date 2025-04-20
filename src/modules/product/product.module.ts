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

const httpControllers = [
  CreateProductHttpController,
  FindAllProductsHttpController,
  FindProductByIdHttpController,
  EditProductByIdHttpController,
];

const commandHandlers: Provider[] = [
  CreateProductService,
  FindProductsService,
  FindProductService,
  EditProductService,
];

const queryHandlers: Provider[] = [];

const repositories: Provider[] = [PrismaProductRepository];

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers],
  providers: [Logger, ...repositories, ...commandHandlers, ...queryHandlers],
})
export class ProductModule {}
