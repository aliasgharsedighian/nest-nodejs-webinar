import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { routesV1 } from 'src/config/app.routes';
import { CreateArticleCategoryService } from './create-article-category.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { JwtGuard } from 'src/libs/guard';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { User } from '@prisma/client';
import { GetUser } from 'src/libs/decorators';
import { CreateArticleCategoryRequestDto } from './create-article-category.request.dto';

@Controller(routesV1.version)
export class CreateArticleCategoryHttpController {
  constructor(private createProductCategory: CreateArticleCategoryService) {}

  @ApiOperation({ summary: 'create article category' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: '',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(routesV1.article.createArticleCategory)
  async create(
    @Body() body: CreateArticleCategoryRequestDto,
    @GetUser() user: User,
  ) {
    const result = await this.createProductCategory.execute(body, user);

    return result;
  }
}
