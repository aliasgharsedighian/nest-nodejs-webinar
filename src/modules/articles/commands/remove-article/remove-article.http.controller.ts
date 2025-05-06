import {
  Controller,
  Delete,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { routesV1 } from 'src/config/app.routes';
import { Roles } from 'src/libs/decorators/roles.decorator';
import { JwtGuard } from 'src/libs/guard';
import { RolesGuard } from 'src/libs/guard/role.guard';
import { DeleteArticleParamsDto } from './remove-article.request.dto';
import { User } from '@prisma/client';
import { GetUser } from 'src/libs/decorators';
import { RemoveArticleService } from './remove-article.service';

@Controller(routesV1.version)
export class RemoveArticleBySlugHttpController {
  constructor(private removeArticle: RemoveArticleService) {}

  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(routesV1.article.removeArticle)
  @ApiOperation({ summary: 'find and delete article by id' })
  @ApiResponse({
    status: HttpStatus.OK,
    type: '',
  })
  async removeArticleBySlug(
    @Param() params: DeleteArticleParamsDto,
    @GetUser() user: User,
  ) {
    const result = await this.removeArticle.execute(params.slug, user);

    return result;
  }
}
