import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetArticleParamsDto {
  @Type(() => String)
  @IsString()
  slug: string;
}
