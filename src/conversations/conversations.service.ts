import { Injectable } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { OpenAIService } from '../openai/openai.service';
import { RagDocumentsService } from '../rag-documents/rag-documents.service';
import { TelegramService } from '../telegram/telegram.service';
import { ConversationEntity } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConversationMessageEntity } from './entities/conversation-message.entity';
import { OpenAIHistoryMessage } from '../openai/openai.types';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly openai: OpenAIService,
    private readonly rag: RagDocumentsService,
    private readonly telegram: TelegramService,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
    @InjectRepository(ConversationMessageEntity)
    private readonly conversationMessageRepository: Repository<ConversationMessageEntity>,
  ) {}

  create(createConversationDto: CreateConversationDto) {
    return 'This action adds a new conversation';
  }

  findAll() {
    return `This action returns all conversations`;
  }

  findOne(id: number) {
    return `This action returns a #${id} conversation`;
  }

  update(id: number, updateConversationDto: UpdateConversationDto) {
    return `This action updates a #${id} conversation`;
  }

  remove(id: number) {
    return `This action removes a #${id} conversation`;
  }

  async handleMessage(
    userID: string,
    text: string,
    metadata: { firstName?: string; lastName?: string; photo?: string },
  ) {
    const conversation = await this.getOrCreateConversation(userID, metadata);

    const ragDocs = await this.rag.search(text);
    const context = ragDocs.map((d) => d.content).join('\n---\n');

    const lastMessages = await this.getLastMessages(conversation.id, 4);
    const history = lastMessages.reverse().reduce((acc, curr) => {
      return [
        ...acc,
        { role: 'user', content: curr.userMessage },
        { role: 'assistant', content: curr.aiResponse },
      ];
    }, []) as Array<OpenAIHistoryMessage>;

    const answer = await this.openai.chat({
      message: text,
      context: context,
      history: history,
      summary: conversation.summary ?? undefined,
    });

    const txtContent =
      `QUESTION:\n${text}\n\nANSWER:\n${answer}\n\n--------------------\n\nCONTEXT:\n${JSON.stringify(ragDocs, null, 2)}\n\n--------------------\n\nSUMMARY:\n${JSON.stringify(conversation.summary, null, 2)}\n\n--------------------\n\nHISTORY:\n${JSON.stringify(history, null, 2)}`.trim();
    const logMessage = `Question from [user](tg://user?id=${userID}) ${userID}:\n${text}`;
    await this.telegram.sendLogWithFile(logMessage, txtContent);

    const messageEntity = this.conversationMessageRepository.create({
      userMessage: text,
      aiResponse: answer,
      conversation: { id: conversation.id },
      embedding: await this.openai.embed(`User: ${text}; AI: ${answer}`),
      usedDocuments: ragDocs.map((d) => ({ id: d.id })),
    });

    await this.conversationMessageRepository.save(messageEntity);

    conversation.messagesCount += 1;
    const isSummaryUpdateNeeded =
      conversation.messagesCount > 0 && conversation.messagesCount % 5 === 0;
    if (isSummaryUpdateNeeded) {
      conversation.summary = await this.openai.summary(conversation.summary, [
        ...history,
        { role: 'user', content: text },
        { role: 'assistant', content: answer },
      ]);
    }

    await this.conversationRepository.save(conversation);

    return answer;
  }

  private async getOrCreateConversation(
    externalId: string,
    metadata?: Record<string, string>,
  ) {
    let conversation = await this.conversationRepository.findOne({
      where: { externalId },
    });

    if (!conversation) {
      conversation = this.conversationRepository.create({
        summary: null,
        messagesCount: 0,
        externalId: externalId,
        userMetadata: metadata ?? null,
      });

      conversation = await this.conversationRepository.save(conversation);
    }

    return conversation;
  }

  private async getLastMessages(conversationId: string, limit = 4) {
    return this.conversationMessageRepository.find({
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
