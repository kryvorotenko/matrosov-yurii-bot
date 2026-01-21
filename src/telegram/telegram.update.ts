import { TelegramService } from './telegram.service';
import { Ctx, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { ConversationsService } from '../conversations/conversations.service';

@Update()
export class TelegramUpdate {
  constructor(
    private readonly telegramService: TelegramService,
    private readonly conversationService: ConversationsService,
  ) {}

  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply('Привет!');
  }

  @On('text')
  async onMessage(@Ctx() ctx: Context) {
    if (!ctx.message || !('text' in ctx.message)) {
      return;
    }

    const text = ctx.message.text;
    const userID = ctx.message.from.id;
    const userFirstName = ctx.message.from.first_name;
    const userLastName = ctx.message.from.last_name;
    const userPhoto = await this.telegramService.getUserPhotoUrl(userID);

    const answer = await this.conversationService.handleMessage(
      'tg_dm:' + userID,
      text,
      {
        firstName: userFirstName,
        lastName: userLastName,
        photo: userPhoto,
      },
    );

    await ctx.reply(answer);
  }
}
