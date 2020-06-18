require('dotenv').config();
const { Telegraf } = require('telegraf');
const Catalog = require('./catalog.js');
const Extra = require('telegraf/extra');
const fs = require('fs');
const Markup = require('telegraf/markup');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply(`Привет ${ctx.message.from.first_name}. Для выбора товара используйте кнопку или введите его наименование:
Стулья,
Шкафы,
Столы,
Диваны.`)
  setInterval(() => {
    ctx.reply('Товары на скидке');
    sendMsgPack(ctx, Catalog.salesCatalog);
  }, 20000);

 
});

async function sendMsgPack(ctx, msgArray) {
  cat = [];
  for (const msg of msgArray) {
    await cat.push({
      type: 'photo',
      caption: msg.cap,
      media: { source: fs.createReadStream(msg.img) },
    });
  }
  console.log(cat);
  ctx.replyWithMediaGroup(cat);
}



bot.hears('Диваны', (ctx) => {
  sendMsgPack(ctx, Catalog.sofasCatalog);
});

bot.hears('Стулья', (ctx) => {
  sendMsgPack(ctx, Catalog.chairsCatalog);
});

bot.hears('Шкафы', (ctx) => {
  sendMsgPack(ctx, Catalog.cupboardsCatalog);
});

bot.hears('Столы', (ctx) => {
  sendMsgPack(ctx, Catalog.tablesCatalog);
});

bot.help((ctx) => {
  ctx.reply(`
Чтобы увидеть каталог стульев, введите - Стулья
Чтобы увидеть каталог шкафов, введите - Шкафы
Чтобы увидеть каталог столов, введите - Столы
Чтобы увидеть каталог диванов, введите - Диваны`);
});

bot.on('text', (ctx)=>{
  ctx.reply(`Видимо вы ввели что то неправильно.
Введите /help или нажмите кнопку, чтобы увидеть список команд`,
Markup.keyboard([
  ['/help'],
])
  .resize()
  .extra());
})
bot.launch();
