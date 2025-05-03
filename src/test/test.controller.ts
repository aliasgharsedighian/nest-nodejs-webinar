import { Controller, Post } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { DeleteOriginalsJob } from 'src/jobs/delete-orginal-images.job';

@Controller(routesV1.version)
export class TestController {
  constructor(private readonly deleteOriginalsJob: DeleteOriginalsJob) {}

  @Post('run-delete-job')
  async runDeleteJob() {
    await this.deleteOriginalsJob.run(); // call manually
    return { message: 'Job triggered' };
  }
}
