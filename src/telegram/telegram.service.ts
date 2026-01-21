import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegram } from 'telegraf';

@Injectable()
export class TelegramService {
  private readonly telegramBotToken: string;
  private readonly telegramChatId: string;

  constructor(
    private readonly config: ConfigService,
    private readonly telegram: Telegram,
  ) {
    this.telegramBotToken = this.config.get<string>('TELEGRAM_BOT_TOKEN') || '';
    this.telegramChatId = this.config.get<string>('TELEGRAM_LOGS_ID') || '';
  }

  async getUserPhotoUrl(userID: number): Promise<string | undefined> {
    if (!this.telegramBotToken) return undefined;
    const photos = await this.telegram.getUserProfilePhotos(userID, 1);

    if (!photos.total_count) {
      return undefined;
    }

    const photo = photos.photos[0][0];
    const file = await this.telegram.getFile(photo.file_id);

    return `https://api.telegram.org/file/bot${this.telegramBotToken}/${file.file_path}`;
  }

  async sendLogWithFile(caption: string, fileContent: string) {
    if (!this.telegramBotToken || !this.telegramChatId) return;

    const url = `https://api.telegram.org/bot${this.telegramBotToken}/sendDocument`;

    const form = new FormData();
    form.append('chat_id', this.telegramChatId);
    form.append('caption', caption);
    form.append('parse_mode', 'Markdown');

    const blob = new Blob([fileContent], { type: 'text/plain' });
    form.append('document', blob, `log-${Date.now()}.txt`);

    await fetch(url, { method: 'POST', body: form });
  }

  private escapeMarkdown(text: string): string {
    return text.replace(/([_*[\]()~`>#+\-=|{}.!])/g, '\\$1');
  }
}
