import { Module } from '@nestjs/common';
import { PersonalitiesService } from './personalities.service';
import { PersonalitiesController } from './personalities.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Personality } from './entities/personality.entity';
import { RagDocumentEntity } from '../rag-documents/entities/rag-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Personality, RagDocumentEntity])],
  controllers: [PersonalitiesController],
  providers: [PersonalitiesService],
})
export class PersonalitiesModule {}
