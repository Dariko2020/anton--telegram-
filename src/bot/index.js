require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const db = require('../db');

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = parseInt(process.env.ADMIN_ID || '0', 10);

const mainMenu = Markup.keyboard([
  ['\uD83D\uDD0D Начать поиск'],
  ['\uD83D\uDCB0 Пополнить баланс'],
  ['\uD83D\uDCC4 Условия поиска'],
  ['\u2699\uFE0F Техподдержка']
]).resize();

bot.start(async (ctx) => {
  await ensureUser(ctx.from.id);
  await ctx.reply(
    `\uD83E\uDD20 Вы в главном меню.\n\uD83E\uDD20 Мой функционал:\n\uD83D\uDD39 Массовый поиск через файл txt.\n\uD83D\uDD39 Ручной поиск по одному запросу.\n\uD83D\uDD39 Поиск по нескольким параметрам одновременно.\n\n\uD83D\uDCB0 Стоимость: 1000 запросов = $1`,
    mainMenu
  );
});

async function ensureUser(telegramId) {
  return new Promise((resolve, reject) => {
    db.get('SELECT id FROM users WHERE telegram_id = ?', [telegramId], (err, row) => {
      if (err) return reject(err);
      if (!row) {
        db.run('INSERT INTO users(telegram_id) VALUES(?)', [telegramId], (e) => {
          if (e) return reject(e);
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
}

// conditions
bot.hears('\uD83D\uDCC4 Условия поиска', async (ctx) => {
  await ctx.reply(
    '\uD83D\uDD0D Поиск:\n\uD83D\uDCC4 Отправьте текстовый файл (.txt) с запросами\n   Каждая строка — отдельный запрос\n\u26A0\uFE0F Поиск через обычные сообщения отключён.',
    Markup.keyboard(['\u2190 Назад в главное меню']).resize()
  );
});

bot.hears('\u2190 Назад в главное меню', async (ctx) => {
  await ctx.reply('Возврат в главное меню', mainMenu);
});

bot.launch().then(() => {
  console.log('Bot started');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
