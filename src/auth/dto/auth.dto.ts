import { IsString } from 'class-validator';

export class AuthKeyDto {
  @IsString()
  key: string;
}
