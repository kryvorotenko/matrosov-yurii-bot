import {
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreatePersonalityDto {
  @IsString()
  @MaxLength(32)
  role: string;

  @IsString()
  @MaxLength(128)
  name: string;

  @IsString()
  information?: string;

  @IsString()
  communicationStyle: string;

  @IsString()
  forbiddenTopics: string;

  @IsArray()
  @IsUUID('4', { each: true })
  allowedRagDocumentIds?: string[];

  @IsArray()
  @IsUUID('4', { each: true })
  forbiddenRagDocumentIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(64, { each: true })
  aliases?: string[];
}
