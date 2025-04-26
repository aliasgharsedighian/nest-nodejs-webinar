import { IsNotEmpty, IsNumber, IsString, Matches, Max } from 'class-validator';

export class ImageFileValidator {
  @IsNotEmpty()
  @IsString()
  originalname: string;

  @IsNotEmpty()
  @IsString()
  mimetype: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsNotEmpty()
  @IsString()
  path: string;

  @Matches(/^(image\/jpeg|image\/png|image\/webp)$/, {
    message: 'File must be a JPEG, PNG, or WEBP image',
  })
  mimetypeValidation: string;

  @Max(5 * 1024 * 1024, { message: 'File size must not exceed 5MB' })
  sizeValidation: number;
}
