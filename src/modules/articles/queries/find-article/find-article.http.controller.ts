import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetArticleParamsDto } from './find-article.request.dto';
import { FindArticleService } from './find-article.service';

@Controller(routesV1.version)
export class FindArticleByIdHttpController {
  constructor(private findArticle: FindArticleService) {}
  @Get(routesV1.article.showArticle)
  @ApiOperation({ summary: 'find single Article with id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  async findArticleById(@Param() params: GetArticleParamsDto) {
    const result = await this.findArticle.execute(params.slug);

    return result;
  }
}
