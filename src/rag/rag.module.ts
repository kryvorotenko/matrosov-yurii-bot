import { forwardRef, Module } from '@nestjs/common';
import { RAGService } from './rag.service';
import { RagDocumentsModule } from '../rag-documents/rag-documents.module';

@Module({
  providers: [RAGService],
  exports: [RAGService],
  imports: [forwardRef(() => RagDocumentsModule)],
})
export class RAGModule {}
