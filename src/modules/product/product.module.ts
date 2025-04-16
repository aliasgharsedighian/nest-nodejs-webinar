import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

const httpControllers = [];

const commandHandlers: Provider[] = [];

const queryHandlers: Provider[] = [];

const repositories: Provider[] = [];

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers],
  providers: [Logger, ...repositories, ...commandHandlers, ...queryHandlers],
})
export class ProductModule {}
