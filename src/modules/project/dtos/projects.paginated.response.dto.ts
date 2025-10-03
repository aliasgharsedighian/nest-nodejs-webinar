import { ApiProperty } from '@nestjs/swagger';
import { ProjectsResponseDto } from './projects.response.dto';

export class ProjectsPaginatedResponseDto {
  @ApiProperty({ type: ProjectsResponseDto, isArray: true })
  readonly data: readonly ProjectsResponseDto[];
}
