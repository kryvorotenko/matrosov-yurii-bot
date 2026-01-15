import { TelegramService } from './telegram.service';
import { Ctx, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
export class TelegramUpdate {
  constructor(private readonly telegramService: TelegramService) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply('Привет! Я AI бот с RAG 🧠');
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context) {
    const text = ctx.message?.['text'] || "";
    const answer = await this.telegramService.handleMessage(text);
    await ctx.reply(answer);
  }
}
