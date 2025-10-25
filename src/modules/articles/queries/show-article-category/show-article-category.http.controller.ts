import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetArticleCategoryParamsDto } from './show-article-category.request.dto';
import { FindArticleCategoryService } from './show-article-category.service';

@Controller(routesV1.version)
export class FindArticleCategoryByIdHttpController {
  constructor(private findArticle: FindArticleCategoryService) {}
  @Get(routesV1.article.showArticleCategory)
  @ApiOperation({ summary: 'find single article category with id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  async findProducCategorytById(@Param() params: GetArticleCategoryParamsDto) {
    const result = await this.findArticle.execute(params.id);

    return result;
  }
}
