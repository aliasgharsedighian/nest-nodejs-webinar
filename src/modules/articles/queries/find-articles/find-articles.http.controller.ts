import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';
import { FindArticlesService } from './find-articles.service';
import { ArticlesPaginatedResponseDto } from '../../dtos/articles.paginated.response.dto';

@Controller(routesV1.version)
export class FindAllArticlesHttpController {
  constructor(private findAllArticles: FindArticlesService) {}

  @Get(routesV1.article.getAllArticles)
  @ApiOperation({ summary: 'find all articles with paginate' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ArticlesPaginatedResponseDto,
  })
  async findArticles(@Query() queryParams: PaginatedQueryRequestDto) {
    const result = await this.findAllArticles.execute(queryParams);

    return {
      statusCode: HttpStatus.OK,
      message: 'get all articles successfully',
      data: result,
    };
  }
}
