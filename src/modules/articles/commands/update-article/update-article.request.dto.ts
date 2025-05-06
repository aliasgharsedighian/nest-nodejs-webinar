import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from '../create-article/create-article.request.dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
