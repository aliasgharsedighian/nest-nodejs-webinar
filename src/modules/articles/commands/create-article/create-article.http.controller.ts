import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  BadRequestException,
  UploadedFile,
} from '@nestjs/common';
import { CreateArticleDto } from './create-article.request.dto';
import { routesV1 } from 'src/config/app.routes';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { JwtGuard } from 'src/libs/guard';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUser } from 'src/libs/decorators';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateArticleService } from './create-article.service';

@Controller(routesV1.version)
export class CreateArticleHttpController {
  constructor(private articleService: CreateArticleService) {}

  @ApiOperation({ summary: 'Create a Article' })
  @ApiResponse({
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Article Already Exist',
    type: '',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    type: '',
  })
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Post(routesV1.article.createArticle)
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
  async create(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: CreateArticleDto,
    @GetUser() user: User,
  ) {
    if (!image) {
      throw new BadRequestException('Check your image(s)');
    }
    const result = await this.articleService.execute(body, image, user);

    return result;
  }
}
