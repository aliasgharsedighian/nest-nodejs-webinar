import { Module } from '@nestjs/common';
import { FindUserHttpController } from './queries/find-user/find-user.http.controller';

const httpControllers = [FindUserHttpController];

@Module({
  controllers: [...httpControllers],
  providers: [],
})
export class UserModule {}
