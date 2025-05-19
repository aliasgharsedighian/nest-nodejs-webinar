import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FileUploadModule } from '../files-upload/file-upload.module';
import { PrismaProjectRepository } from './database/project.repository';
import { CreateProjectHttpController } from './commands/create-project/create-project.http.controller';
import { CreateProjectService } from './commands/create-project/create-project.service';
import { CreateProjectCategoryHttpController } from './commands/create-project-category/create-project-category.http.controller';
import { CreateProjectCategoryService } from './commands/create-project-category/create-project-category.service';

const httpControllers = [
  CreateProjectHttpController,
  CreateProjectCategoryHttpController,
];

const commandHandlers: Provider[] = [
  CreateProjectService,
  CreateProjectCategoryService,
];

const queryHandlers: Provider[] = [];

const repositories: Provider[] = [PrismaProjectRepository];

@Module({
  imports: [CqrsModule, FileUploadModule],
  controllers: [...httpControllers],
  providers: [Logger, ...repositories, ...commandHandlers, ...queryHandlers],
})
export class ProjectModule {}
