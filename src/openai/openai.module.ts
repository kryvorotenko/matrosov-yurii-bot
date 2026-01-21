import { forwardRef, Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { TelegramModule } from '../telegram/telegram.module';
import { RagDocumentsModule } from '../rag-documents/rag-documents.module';

@Module({
  providers: [OpenAIService],
  exports: [OpenAIService],
  imports: [
    forwardRef(() => TelegramModule),
    forwardRef(() => RagDocumentsModule),
  ],
})
export class OpenAIModule {}
