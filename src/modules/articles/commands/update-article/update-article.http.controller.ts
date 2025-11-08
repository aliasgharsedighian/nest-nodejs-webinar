import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Param,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { routesV1 } from 'src/config/app.routes';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { JwtGuard } from 'src/libs/guard';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { GetArticleParamsDto } from '../../queries/find-article/find-article.request.dto';
import { GetUser } from 'src/libs/decorators';
import { User } from '@prisma/client';
import { EditArticleRequestDto } from './update-article.request.dto';
import { EditArticleService } from './update-article.service';
import { ImageUploadInterceptor } from 'src/libs/common/image-upload.interceptor';

@Controller(routesV1.version)
export class EditArticleBySlugHttpController {
  constructor(private editArticle: EditArticleService) {}

  @ApiOperation({ summary: 'edit article with id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(routesV1.article.editArticle)
  @ImageUploadInterceptor({ type: 'single', fieldName: 'image' })
  async edit(
    @Body() body: EditArticleRequestDto,
    @Param() params: GetArticleParamsDto,
    @GetUser() user: User,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const result = await this.editArticle.execute(
      body,
      params.slug,
      image,
      user,
    );

    return result;
  }
}
