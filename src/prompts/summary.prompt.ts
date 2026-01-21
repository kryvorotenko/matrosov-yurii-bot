import { OpenAIHistoryMessage } from '../openai/openai.types';

export const SUMMARY_PROMPT = (
  prevSummary: string | null,
  newMessages: Array<OpenAIHistoryMessage>,
) =>
  `Твоя задача - создать или дополнить краткое содержание диалога. В ответ выдай только новое краткое содержание. Не давай никаких своих комментариев. Никаких дополнительных разметок.

Текущее краткое содержание:
${prevSummary ?? 'нету'}

Новые сообщения:
${newMessages.map((msg) => `${msg.role}: ${msg.content}`).join('\n')}

Обнови это краткое содержание. Сохраняй это четким, кратким и простым. Сохраняй все самое главное - решения, подходы, детали, тему`;
