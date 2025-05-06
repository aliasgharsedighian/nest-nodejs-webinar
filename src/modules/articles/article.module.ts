import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateArticleHttpController } from './commands/create-article/create-article.http.controller';
import { CreateArticleService } from './commands/create-article/create-article.service';
import { PrismaArticleRepository } from './database/article.repository';
import { FileUploadModule } from '../files-upload/file-upload.module';
import { CreateArticleCategoryHttpController } from './commands/create-article-category/create-article-category.http.controller';
import { CreateArticleCategoryService } from './commands/create-article-category/create-article-category.service';
import { FindArticlesService } from './queries/find-articles/find-articles.service';
import { FindAllArticlesHttpController } from './queries/find-articles/find-articles.http.controller';
import { FindArticleByIdHttpController } from './queries/find-article/find-article.http.controller';
import { FindArticleService } from './queries/find-article/find-article.service';

const httpControllers = [
  CreateArticleHttpController,
  CreateArticleCategoryHttpController,
  FindAllArticlesHttpController,
  FindArticleByIdHttpController,
];
const commandHandlers: Provider[] = [
  CreateArticleService,
  CreateArticleCategoryService,
];
const queryHandlers: Provider[] = [FindArticlesService, FindArticleService];
const repositories: Provider[] = [PrismaArticleRepository];

@Module({
  imports: [CqrsModule, FileUploadModule],
  controllers: [...httpControllers],
  providers: [Logger, ...repositories, ...commandHandlers, ...queryHandlers],
})
export class ArticleModule {}
