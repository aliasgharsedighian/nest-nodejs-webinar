import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum Status {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export class EditUserRequestSupportRequestDto {
  @IsEnum(Status)
  //   @IsString()
  @IsOptional()
  status: Status;
}
