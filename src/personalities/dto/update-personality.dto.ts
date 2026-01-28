import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonalityDto } from './create-personality.dto';

export class UpdatePersonalityDto extends PartialType(CreatePersonalityDto) {}
