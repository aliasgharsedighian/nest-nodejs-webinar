import { Logger, Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { FileUploadModule } from '../files-upload/file-upload.module';
import { PrismaProjectRepository } from './database/project.repository';
import { CreateProjectHttpController } from './commands/create-project/create-project.http.controller';
import { CreateProjectService } from './commands/create-project/create-project.service';
import { CreateProjectCategoryHttpController } from './commands/create-project-category/create-project-category.http.controller';
import { CreateProjectCategoryService } from './commands/create-project-category/create-project-category.service';
import { UpdateProjectService } from './commands/update-project/update-project.service';
import { UpdateProjectHttpController } from './commands/update-project/update-project.http.controller';
import { FindProjectByIdHttpController } from './queries/find-single-project/find-single-project.http.controller';
import { FindProjectService } from './queries/find-single-project/find-single-project.service';
import { FindAllProjectsHttpController } from './queries/find-projects/find-projects.http.controller';
import { FindProjectsService } from './queries/find-projects/find-projects.service';
import { FindProjectLabelImagesHttpController } from './queries/find-projects-label/find-projects-label.http.controller';
import { FindProjectLabelImageService } from './queries/find-projects-label/find-projects-label.service';
import { FindAllAdminProjectsHttpController } from './queries/find-all-projects-admin/find-all-projects-admin.http.controller';
import { FindAllProjectsAdminService } from './queries/find-all-projects-admin/find-all-projects-admin.service';

const httpControllers = [
  FindProjectByIdHttpController,
  CreateProjectHttpController,
  CreateProjectCategoryHttpController,
  UpdateProjectHttpController,
  FindAllProjectsHttpController,
  FindProjectLabelImagesHttpController,
  FindAllAdminProjectsHttpController,
];

const commandHandlers: Provider[] = [
  CreateProjectService,
  CreateProjectCategoryService,
  UpdateProjectService,
];

const queryHandlers: Provider[] = [
  FindProjectService,
  FindProjectsService,
  FindProjectLabelImageService,
  FindAllProjectsAdminService,
];

const repositories: Provider[] = [PrismaProjectRepository];

@Module({
  imports: [CqrsModule, FileUploadModule],
  controllers: [...httpControllers],
  providers: [Logger, ...repositories, ...commandHandlers, ...queryHandlers],
})
export class ProjectModule {}
