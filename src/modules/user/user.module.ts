import { Module, Provider } from '@nestjs/common';
import { FindUserHttpController } from './queries/find-user/find-user.http.controller';
import { FindUserService } from './queries/find-user/find-user.service';
import { PrismaUserRepository } from './database/user.repository';
import { UpdateProfileService } from './commands/update-profile/update-profile.service';
import { UpdateProfileHttpController } from './commands/update-profile/update-profile.http.controller';
import { EditUserService } from './commands/update-user/update-user.service';
import { EditUserByAdminHttpController } from './commands/update-user/update-user.http.controller';
import { CreateSupportRequestService } from './commands/create-support-request/create-support-request.service';
import { CreateSupportRequestHttpController } from './commands/create-support-request/create-support-request.http.controller';
import { GetAllSupportRequestHttpController } from './queries/find-all-support-request/find-all-support-request.http.controller';
import { FindSingleSupportRequestHttpController } from './queries/find-single-support-request/find-single-support-request.http.controller';
import { GetAllSupportRequestsService } from './queries/find-all-support-request/find-all-support-request.service';
import { GetSupportRequestByIdService } from './queries/find-single-support-request/find-single-support-request.service';
import { UpdateUserRequestSupportHttpController } from './commands/update-request-support/update-request-support.http.controller';
import { EditRequestService } from './commands/update-request-support/update-request-support.service';

const httpControllers = [
  FindUserHttpController,
  UpdateProfileHttpController,
  EditUserByAdminHttpController,
  CreateSupportRequestHttpController,
  GetAllSupportRequestHttpController,
  FindSingleSupportRequestHttpController,
  UpdateUserRequestSupportHttpController,
];
const commandHandlers: Provider[] = [
  UpdateProfileService,
  EditUserService,
  CreateSupportRequestService,
  EditRequestService,
];
const queryHandlers: Provider[] = [
  FindUserService,
  GetAllSupportRequestsService,
  GetSupportRequestByIdService,
];
const repositories: Provider[] = [PrismaUserRepository];

@Module({
  controllers: [...httpControllers],
  providers: [...commandHandlers, ...queryHandlers, ...repositories],
})
export class UserModule {}
