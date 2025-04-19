import { Module } from '@nestjs/common';
import { FindUserHttpController } from './queries/find-user/find-user.http.controller';
import { FindUserService } from './queries/find-user/find-user.service';

const httpControllers = [FindUserHttpController];

@Module({
  controllers: [...httpControllers],
  providers: [FindUserService],
})
export class UserModule {}
