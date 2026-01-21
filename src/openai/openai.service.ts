import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { SYSTEM_PROMPT } from '../prompts/system.prompt';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions/completions';
import { OpenAIHistoryMessage } from './openai.types';
import { SUMMARY_PROMPT } from '../prompts/summary.prompt';

@Injectable()
export class OpenAIService {
  private client: OpenAI;

  constructor(private readonly config: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.config.get<string>('OPENAI_API_KEY'),
    });
  }

  async chat(props: {
    message: string;
    context?: string;
    summary?: string;
    history?: Array<OpenAIHistoryMessage>;
  }): Promise<string> {
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT(props.context || '') },
    ];

    if (props.summary) {
      const summaryPrompt =
        'Краткое содержание предыдущего диалога: ' + props.summary;
      messages.push({ role: 'system', content: summaryPrompt });
    }

    messages.push(...(props.history || []));
    messages.push({ role: 'user', content: props.message });

    const response = await this.client.chat.completions.create({
      model: 'gpt-4.1',
      messages: messages,
    });

    return response.choices[0].message.content || '';
  }

  async summary(
    prevSummary: string | null,
    newMessages: Array<OpenAIHistoryMessage>,
  ) {
    const response = await this.client.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: SUMMARY_PROMPT(prevSummary, newMessages) },
      ],
    });
    return response.choices[0].message.content || '';
  }

  async embed(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-3-large',
      input: text,
    });

    return response.data[0].embedding;
  }
}
