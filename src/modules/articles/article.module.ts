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
import { FindArticleBySlugHttpController } from './queries/find-article/find-article.http.controller';
import { FindArticleService } from './queries/find-article/find-article.service';
import { EditArticleBySlugHttpController } from './commands/update-article/update-article.http.controller';
import { EditArticleService } from './commands/update-article/update-article.service';

const httpControllers = [
  CreateArticleHttpController,
  CreateArticleCategoryHttpController,
  FindAllArticlesHttpController,
  FindArticleBySlugHttpController,
  EditArticleBySlugHttpController,
];
const commandHandlers: Provider[] = [
  CreateArticleService,
  CreateArticleCategoryService,
  EditArticleService,
];
const queryHandlers: Provider[] = [FindArticlesService, FindArticleService];
const repositories: Provider[] = [PrismaArticleRepository];

@Module({
  imports: [CqrsModule, FileUploadModule],
  controllers: [...httpControllers],
  providers: [Logger, ...repositories, ...commandHandlers, ...queryHandlers],
})
export class ArticleModule {}
