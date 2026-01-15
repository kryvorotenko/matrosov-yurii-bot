import { Injectable } from '@nestjs/common';
import { OpenAIService } from '../openai/openai.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramService {
  private readonly telegramBotToken: string;
  private readonly telegramChatId: string;

  constructor(
    private readonly openAI: OpenAIService,
    private readonly config: ConfigService,
  ) {
    this.telegramBotToken = this.config.get<string>('TELEGRAM_BOT_TOKEN') || '';
    this.telegramChatId = this.config.get<string>('TELEGRAM_LOGS_ID') || '';
  }

  async handleMessage(userID: number, message: string): Promise<string> {
    return this.openAI.chat(userID, message);
  }

  async sendQuestionWithLogFile(
    userID: number,
    caption: string,
    fileContent: string,
  ) {
    if (!this.telegramBotToken || !this.telegramChatId) return;

    const url = `https://api.telegram.org/bot${this.telegramBotToken}/sendDocument`;

    const form = new FormData();

    form.append('chat_id', this.telegramChatId);
    form.append(
      'caption',
      `Question from [user](tg://user?id=${userID}):\n${caption}`,
    );
    form.append('parse_mode', 'Markdown');

    const blob = new Blob([fileContent], { type: 'text/plain' });

    form.append('document', blob, `log-${Date.now()}.txt`);

    await fetch(url, {
      method: 'POST',
      body: form,
    });
  }

  private escapeMarkdown(text: string): string {
    return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
  }
}
