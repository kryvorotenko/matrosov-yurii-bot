import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PersonalitiesService } from './personalities.service';
import { CreatePersonalityDto } from './dto/create-personality.dto';
import { UpdatePersonalityDto } from './dto/update-personality.dto';
import { Personality } from './entities/personality.entity';
import { ApiKeyGuard } from '../auth/api-key.guard';

@UseGuards(ApiKeyGuard)
@Controller('personalities')
export class PersonalitiesController {
  constructor(private readonly personalitiesService: PersonalitiesService) {}

  @Post()
  create(@Body() dto: CreatePersonalityDto): Promise<Personality> {
    return this.personalitiesService.create(dto);
  }

  @Get()
  findAll(): Promise<Personality[]> {
    return this.personalitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Personality> {
    return this.personalitiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePersonalityDto,
  ): Promise<Personality> {
    return this.personalitiesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.personalitiesService.remove(id);
  }
}
