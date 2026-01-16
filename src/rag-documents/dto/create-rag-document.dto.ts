import { IsString, MinLength, MaxLength } from 'class-validator';

export class CreateRagDocumentDto {
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  title: string;

  @IsString()
  @MinLength(1)
  content: string;
}
