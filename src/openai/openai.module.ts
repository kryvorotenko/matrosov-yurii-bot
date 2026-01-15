import { forwardRef, Module } from '@nestjs/common';
import { OpenAIService } from './openai.service';
import { RAGModule } from '../rag/rag.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  providers: [OpenAIService],
  exports: [OpenAIService],
  imports: [forwardRef(() => RAGModule), forwardRef(() => TelegramModule)],
})
export class OpenAIModule {}
