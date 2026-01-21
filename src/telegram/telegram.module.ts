import { forwardRef, Module } from '@nestjs/common';
import { TelegramUpdate } from './telegram.update';
import { TelegramService } from './telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { ConversationsModule } from '../conversations/conversations.module';
import { Telegram } from 'telegraf';

@Module({
  imports: [
    forwardRef(() => ConversationsModule),
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        token: config.get<string>('TELEGRAM_BOT_TOKEN')!,
      }),
    }),
  ],
  providers: [
    TelegramUpdate,
    TelegramService,
    {
      provide: Telegram,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Telegram(config.get<string>('TELEGRAM_BOT_TOKEN')!),
    },
  ],
  exports: [TelegramService],
})
export class TelegramModule {}
