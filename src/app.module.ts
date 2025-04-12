import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // Modules
    AuthModule,
    UserModule,
    ProductModule,
    PrismaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
