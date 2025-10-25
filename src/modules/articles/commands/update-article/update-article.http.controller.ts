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
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          // @ts-ignore
          const filename = `${Date.now()}-${file.originalname.replaceAll(' ', '-')}`; // Rename the file to include the timestamp
          callback(null, filename);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, //5 mb limit
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimeTypes.includes(file.mimetype)) {
          cb(null, true); // Accept the file
        } else {
          cb(
            new BadRequestException(`Unsupported file type ${file.mimetype}`),
            false,
          ); // Reject the file
        }
      },
    }),
  )
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
