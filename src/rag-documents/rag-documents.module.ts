import { forwardRef, Module } from '@nestjs/common';
import { RagDocumentsService } from './rag-documents.service';
import { RagDocumentsController } from './rag-documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RagDocumentEntity } from './entities/rag-document.entity';
import { OpenAIModule } from '../openai/openai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RagDocumentEntity]),
    forwardRef(() => OpenAIModule),
  ],
  providers: [RagDocumentsService],
  controllers: [RagDocumentsController],
  exports: [RagDocumentsService],
})
export class RagDocumentsModule {}
