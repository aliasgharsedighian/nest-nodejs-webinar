import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { JobsModule } from '../jobs/jobs.module';

@Module({
  imports: [JobsModule],
  controllers: [TestController],
})
export class TestModule {}
