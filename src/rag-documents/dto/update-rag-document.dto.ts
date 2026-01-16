import { IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

export class UpdateRagDocumentDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  content?: string;
}
