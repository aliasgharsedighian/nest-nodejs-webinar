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
import { RemoveArticleBySlugHttpController } from './commands/remove-article/remove-article.http.controller';
import { RemoveArticleService } from './commands/remove-article/remove-article.service';
import { FindAllAdminArticlesHttpController } from './queries/find-all-articles-admin/find-all-articles-admin.http.controller';
import { FindAllArticlesAdminService } from './queries/find-all-articles-admin/find-all-articles-admin.service';
import { FindCategoryArticleService } from './queries/show-articles-categories/show-articles-categories.service';
import { FindCategoryArticleHttpController } from './queries/show-articles-categories/show-articles-categories.http.controller';
import { FindArticleCategoryByIdHttpController } from './queries/show-article-category/show-article-category.http.controller';
import { FindArticleCategoryService } from './queries/show-article-category/show-article-category.service';
import { UpdateArticleCategoryHttpController } from './commands/update-article-category/update-article-category.http.controller';
import { UpdateArticleCategoryService } from './commands/update-article-category/update-article-category.service';

const httpControllers = [
  CreateArticleHttpController,
  CreateArticleCategoryHttpController,
  FindAllArticlesHttpController,
  FindArticleBySlugHttpController,
  EditArticleBySlugHttpController,
  RemoveArticleBySlugHttpController,
  FindAllAdminArticlesHttpController,
  FindCategoryArticleHttpController,
  FindArticleCategoryByIdHttpController,
  UpdateArticleCategoryHttpController,
];
const commandHandlers: Provider[] = [
  CreateArticleService,
  CreateArticleCategoryService,
  EditArticleService,
  RemoveArticleService,
  UpdateArticleCategoryService,
];
const queryHandlers: Provider[] = [
  FindArticlesService,
  FindArticleService,
  FindAllArticlesAdminService,
  FindCategoryArticleService,
  FindArticleCategoryService,
];
const repositories: Provider[] = [PrismaArticleRepository];

@Module({
  imports: [CqrsModule, FileUploadModule],
  controllers: [...httpControllers],
  providers: [Logger, ...repositories, ...commandHandlers, ...queryHandlers],
})
export class ArticleModule {}
