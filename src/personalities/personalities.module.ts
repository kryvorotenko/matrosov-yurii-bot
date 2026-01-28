import { Module } from '@nestjs/common';
import { PersonalitiesService } from './personalities.service';
import { PersonalitiesController } from './personalities.controller';

@Module({
  controllers: [PersonalitiesController],
  providers: [PersonalitiesService],
})
export class PersonalitiesModule {}
