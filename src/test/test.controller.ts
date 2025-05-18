import { Controller, Get, Post, Res } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { DeleteOriginalsJob } from 'src/jobs/delete-orginal-images.job';
import { Response } from 'express';

@Controller(routesV1.version)
export class TestController {
  constructor(private readonly deleteOriginalsJob: DeleteOriginalsJob) {}

  @Post('run-delete-job')
  async runDeleteJob() {
    await this.deleteOriginalsJob.run(); // call manually
    return { message: 'Job triggereds' };
  }

  @Get('/')
  home(@Res() res: Response) {
    res.send('<a href="/auth/google">google auth</a>');
  }
}
