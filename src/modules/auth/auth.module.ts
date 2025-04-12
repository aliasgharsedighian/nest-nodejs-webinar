import { Module } from '@nestjs/common';
import { CreateUserHttpController } from './commands/create-user/create-user.http.controller';
import { CreateUserService } from './commands/create-user/create-user.service';

const httpControllers = [CreateUserHttpController];

@Module({
  controllers: [...httpControllers],
  providers: [CreateUserService],
})
export class AuthModule {}
