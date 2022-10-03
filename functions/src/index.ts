import { Firestore } from '@google-cloud/firestore';
import { onRequest } from 'firebase-functions/v2/https';

import { Context, Telegraf } from 'telegraf';
import { Update } from 'typegram';

const firestore = new Firestore({
  projectId: '1:229629274887:web:c6d786ac33b1744772f3a2',
  timestampsInSnapshots: true
});

function configureBot(token: string): Telegraf<Context<Update>> {
  const bot: Telegraf<Context<Update>> = new Telegraf(token);

  bot.start(ctx => ctx.reply('Hello ' + ctx.from.first_name + '!'));

  bot.command('quit', ctx => ctx.leaveChat());

  bot.on('text', ctx => {
    ctx.reply(process.pid.toString());
  });

  return bot;
}

export const create = onRequest({ cors: true }, async (req, res) => {
  try {
    const { token } = req.body;

    const bot = configureBot(token);

    await bot.launch();

    res.send({ token }).status(200);

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  } catch (err) {
    res.send({ err }).status(500);
  }
});
