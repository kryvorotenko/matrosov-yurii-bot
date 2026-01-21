import { forwardRef, Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationMessageEntity } from './entities/conversation-message.entity';
import { ConversationEntity } from './entities/conversation.entity';
import { RagDocumentsModule } from '../rag-documents/rag-documents.module';
import { OpenAIModule } from '../openai/openai.module';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  controllers: [ConversationsController],
  providers: [ConversationsService],
  exports: [ConversationsService],
  imports: [
    TypeOrmModule.forFeature([ConversationMessageEntity, ConversationEntity]),
    forwardRef(() => RagDocumentsModule),
    forwardRef(() => OpenAIModule),
    forwardRef(() => TelegramModule),
  ],
})
export class ConversationsModule {}
