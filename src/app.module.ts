import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { PrismaModule } from './libs/db/prisma/prisma.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { FileUploadModule } from './modules/files-upload/file-upload.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TestModule } from './test/test.module';
import { ArticleModule } from './modules/articles/article.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    ThrottlerModule.forRoot([{ limit: 15, ttl: 2 * 60 * 1000 }]), //2 minutes
    // Modules
    AuthModule,
    UserModule,
    ProductModule,
    ArticleModule,
    PrismaModule,
    FileUploadModule,
    TestModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
