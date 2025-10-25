import { Controller, Get, HttpStatus, Param, Query } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';
import { FindCategoryArticleService } from './show-articles-categories.service';

@Controller(routesV1.version)
export class FindCategoryArticleHttpController {
  constructor(private findArticle: FindCategoryArticleService) {}
  @Get(routesV1.article.showCategoriesArticle)
  @ApiOperation({ summary: 'find all category articles' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  async findProductCategries(@Query() queryParams: PaginatedQueryRequestDto) {
    const result = await this.findArticle.execute(queryParams);

    return result;
  }
}
