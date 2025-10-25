import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaginatedQueryRequestDto } from 'src/libs/api/paginated-query.request.dto';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { JwtGuard } from 'src/libs/guard';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { ArticlesPaginatedResponseDto } from '../../dtos/articles.paginated.response.dto';
import { GetArticleParamsDto } from '../find-article/find-article.request.dto';
import { FindAllArticlesAdminService } from './find-all-articles-admin.service';

@UseGuards(JwtGuard, RolesGuard)
@Roles('ADMIN')
@Controller(routesV1.version)
export class FindAllAdminArticlesHttpController {
  constructor(private findAdminArticles: FindAllArticlesAdminService) {}

  @Get(routesV1.article.getAllAdminArticles)
  @ApiOperation({ summary: 'find all articles with paginate' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: ArticlesPaginatedResponseDto,
  })
  async findArticlesAdmin(@Query() queryParams: PaginatedQueryRequestDto) {
    const result = await this.findAdminArticles.findAll(queryParams);

    return {
      statusCode: HttpStatus.OK,
      message: 'get all articles successfully',
      data: result,
    };
  }

  @Get(routesV1.article.showAdminArticle)
  async findArticleAdminBySlug(@Param() params: GetArticleParamsDto) {
    const result = await this.findAdminArticles.findOne(params.slug);

    return result;
  }
}
