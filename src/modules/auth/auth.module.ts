import { Module } from '@nestjs/common';
import { CreateUserHttpController } from './commands/create-user/create-user.http.controller';
import { CreateUserService } from './commands/create-user/create-user.service';
import { SignInUserHttpController } from './queries/signin-user/signin-user.http.controller';
import { SignInUserService } from './queries/signin-user/signin-user.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthTokenService } from './token.service';
import { JwtStrategy } from './strategy';

const httpControllers = [CreateUserHttpController, SignInUserHttpController];

@Module({
  imports: [JwtModule.register({})],
  controllers: [...httpControllers],
  providers: [
    AuthTokenService,
    CreateUserService,
    SignInUserService,
    JwtStrategy,
  ],
  exports: [AuthTokenService],
})
export class AuthModule {}
