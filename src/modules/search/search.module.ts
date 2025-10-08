import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AllSearchHttpController } from './queries/search-all/search-all.http.controller';
import { AllSearchService } from './queries/search-all/search-all.service';
import { PrismaSearchRepository } from './database/search.repository';

const httpControllers = [AllSearchHttpController];

const commandHandlers: Provider[] = [];

const queryHandlers: Provider[] = [AllSearchService];

const repositories: Provider[] = [PrismaSearchRepository];

@Module({
  imports: [CqrsModule],
  controllers: [...httpControllers],
  providers: [Logger, ...repositories, ...commandHandlers, ...queryHandlers],
})
export class SearchModule {}
