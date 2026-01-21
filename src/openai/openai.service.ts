import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { SYSTEM_PROMPT } from '../prompts/system.prompt';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from '../telegram/telegram.service';
import { RagDocumentsService } from '../rag-documents/rag-documents.service';

@Injectable()
export class OpenAIService {
  private client: OpenAI;

  constructor(
    private readonly config: ConfigService,
    @Inject(forwardRef(() => TelegramService))
    private readonly telegram: TelegramService,
    @Inject(forwardRef(() => RagDocumentsService))
    private readonly rag: RagDocumentsService,
  ) {
    this.client = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    });
  }

  async chat(userID: number, userMessage: string): Promise<string> {
    const context = await this.rag.ragSearch(userMessage);

    const response = await this.client.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT(context) },
        { role: 'user', content: userMessage },
      ],
    });

    const aiResponse = response.choices[0].message.content || '';

    const txtContent = `
QUESTION:
${userMessage}

--------------------

CONTEXT:
${context}

--------------------

ANSWER:
${aiResponse}
`.trim();

    await this.telegram.sendQuestionWithLogFile(
      userID,
      userMessage,
      txtContent,
    );

    return aiResponse;
  }

  async embed(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-3-large',
      input: text,
    });

    return response.data[0].embedding;
  }
}
