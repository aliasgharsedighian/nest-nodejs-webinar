import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteArticleParamsDto {
  @Type(() => String)
  @IsString()
  slug: string;
}
