import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from 'src/config/app.routes';
import { JwtGuard } from 'src/libs/guard';
import { GetUser } from 'src/libs/decorators';
import { User } from '@prisma/client';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { UpdateArticleCategoryRequestDto } from './update-article-category.request.dto';
import { UpdateArticleCategoryService } from './update-article-category.service';

@Controller(routesV1.version)
export class UpdateArticleCategoryHttpController {
  constructor(private createArticleCategory: UpdateArticleCategoryService) {}
  @ApiOperation({ summary: 'update article category' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(routesV1.article.editArticleCategory)
  async edit(
    @Body() body: UpdateArticleCategoryRequestDto,
    @GetUser() user: User,
    @Param() params: { id: number },
  ) {
    const result = await this.createArticleCategory.execute(body, params.id);
    return result;
  }
}
