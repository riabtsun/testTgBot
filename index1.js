process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const { Telegraf, Markup } = require("telegraf");
require("dotenv").config();
const text = require("./const");
const { message } = require("telegraf/filters");
const faqText = require("./const");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply(`Вітаю 
 ${
   ctx.message.from.first_name || ctx.message.from.username || "друже"
 }! Я тестовий бот Єфарма, приємно познайомитись!`)
);
bot.help((ctx) =>
  ctx.reply(
    "Виникли питання? Будь ласка опишіть проблему у повідомленні і ми спробуємо її якнайшвидше вирішити"
  )
);

bot.command("menu", async (ctx) => {
  try {
    await ctx.replyWithHTML(
      "<b>Меню</b>",
      Markup.inlineKeyboard([
        [
          Markup.button.callback("Новини", "btn_news"),
          Markup.button.callback("Акції", "btn_2"),
        ],
        [
          Markup.button.callback("ЧаПи", "btn_faq"),
          Markup.button.callback("Партнери", "btn_4"),
        ],
        [
          Markup.button.callback(
            "Програми (Найсвіжіші новини України)",
            "btn_5"
          ),
        ],
      ])
    );
  } catch (e) {
    console.error(e);
  }
});

function addActionBot(name, src, text) {
  bot.action(name, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      if (src !== false) {
        await ctx.replyWithPhoto({ source: src });
      }
      await ctx.replyWithHTML(text, {
        disable_web_page_preview: true,
      });
    } catch (e) {
      console.error(e);
    }
  });
}
// addActionBot("btn_news", false, "Перейти до закртитоЇ групи");
bot.action("btn_news", async (ctx) => {
  try {
    await ctx.answerCbQuery();
    await ctx.replyWithHTML(
      "тут ви можете перейти до закритої группи новин, для цього введіть пароль (підсказка 12345)",
      Markup.inlineKeyboard([
        [Markup.button.callback("Ввести пароль", "btn_news_password")],
      ])
    );
  } catch (e) {
    console.error(e);
  }
});
// Команда эхо "/echo [что-нибудь]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
// 'msg' это полученное сообщение из телеграмма
// 'match' это результат выполнения приведенного выше регулярного выражения для текстового содержимого
// этого сообщения
//   const chatId = msg.chat.id;
//   const resp = match[1]; // захватываем "что-нибудь"
//   bot.sendMessage(chatId, resp); //отправляем обратно в чат "что-нибудь"
// });
addActionBot("btn_faq", false, faqText.faqText);
bot.action("btn_news_password", async (ctx) => {
  bot.hears("12345", async (ctx) => {
    try {
      await ctx.reply("Вітаю");
    } catch (e) {
      console.error(e);
    }
  });
});

// bot.on(message('sticker'), (ctx) => ctx.reply('👍'));
// bot.hears('hi', (ctx) => ctx.reply('Hey there'));

bot.launch();

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
