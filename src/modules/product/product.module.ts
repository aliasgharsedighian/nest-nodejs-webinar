import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductHttpController } from './commands/create-product/create-product.http.controller';
import { CreateProductService } from './commands/create-product/create-product.service';
import { PrismaProductRepository } from './database/product.repository';

const httpControllers = [CreateProductHttpController];

const commandHandlers: Provider[] = [CreateProductService];

const queryHandlers: Provider[] = [];

const repositories: Provider[] = [PrismaProductRepository];

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers],
  providers: [Logger, ...repositories, ...commandHandlers, ...queryHandlers],
})
export class ProductModule {}
