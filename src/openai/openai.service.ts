import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { SYSTEM_PROMPT } from '../prompts/system.prompt';
import { RAGService } from '../rag/rag.service';
import { ConfigService } from '@nestjs/config';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class OpenAIService {
  private client: OpenAI;

  constructor(
    private readonly config: ConfigService,
    @Inject(forwardRef(() => RAGService))
    private readonly rag: RAGService,
    @Inject(forwardRef(() => TelegramService))
    private readonly telegram: TelegramService,
  ) {
    this.client = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    });
  }

  async chat(userMessage: string): Promise<string> {
    const context = await this.rag.getContext(userMessage);

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

    await this.telegram.sendQuestionWithLogFile(userMessage, txtContent);

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
