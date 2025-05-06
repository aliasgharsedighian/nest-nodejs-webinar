import { ApiProperty } from '@nestjs/swagger';
import { ArticlesResponseDto } from './articles.response.dto';

export class ArticlesPaginatedResponseDto {
  @ApiProperty({ type: ArticlesResponseDto, isArray: true })
  readonly data: readonly ArticlesResponseDto[];
}
