// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const TelegramBot = require("node-telegram-bot-api");
const { commands, faqText } = require("./const");

const token = "6231425925:AAEkK52nkHiOn4DKpoSNNtnHAgDnGzI0MZo";

const bot = new TelegramBot(token, { polling: true });
const phone = `Будь ласка, підтвердить вашу особу для доступу до всіх переваг бота. Надішліть номер телефона, натиснувши кнопку нижче.`;
const privacy =
  "Дякуємо! Чи погоджуєтесь ви з політикою конфіденційності використання чат-бота? Переглянути угоду можна за посиланням";
let isAgree = false;
let userInfo = { userAgree: false, userId: null };

bot.setMyCommands([
  { command: "/start", description: "Розпочати" },
  { command: "/info", description: "Отримати інформацію користувача" },
  { command: "/menu", description: "Відкрити меню бота" },
]);

const agreePrivacyBtn = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: "Переглянути угоду", url: "google.com" }],
      [{ text: "Так", callback_data: "yes" }],
    ],
    one_time_keyboard: true,
  }),
};

const menuLinks = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [
        { text: "Новини", callback_data: "/news" },
        { text: "Акції", callback_data: "/promo" },
      ],
      [
        { text: "Запитання", callback_data: "/faq" },
        { text: "Програми", callback_data: "/programs" },
      ],
      [{ text: "Партнери", callback_data: "/partners" }],
    ],
  }),
};

const showPhoneBtn = {
  reply_markup: JSON.stringify({
    keyboard: [
      [
        {
          text: "Відправити номер",
          request_contact: true,
        },
      ],
    ],
    one_time_keyboard: true,
  }),
};

function start() {
  console.log(isAgree);
  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      return bot.sendMessage(
        chatId,
        `Вітаю ${
          msg.from.username || msg.from.first_name || "друже!"
        }. ${phone} `,
        showPhoneBtn
      );
    }
  });
}
start();

bot.on("contact", async (msg) => {
  try {
    await bot.sendMessage(msg.chat.id, privacy, agreePrivacyBtn);
    console.log(isAgree);
  } catch (e) {
    console.error(e);
  }
});

bot.on("callback_query", async (query) => {
  const { from, message, data } = query;
  try {
    if (data === "yes") {
      await bot
        .sendMessage(
          message.chat.id,
          "Дуже добре!  \n" +
            "\n" +
            "Тепер ми ознайомимо вас з меню нашого бота. ",
          menuLinks
        )
        .then(() => {
          userInfo.userAgree = true;
          userInfo.userId = query.from.id;
        });
    }
    if (data === "/faq") {
      await bot.sendMessage(message.chat.id, faqText);
    }
  } catch (e) {
    console.error(e);
  }
  await bot.answerCallbackQuery({
    callback_query_id: query.id,
  });
});

bot.on("message", async (msg) => {
  const text = msg.text;
  try {
    if (
      userInfo.userAgree &&
      userInfo.userId === msg.from.id &&
      text === "/menu"
    ) {
      await bot.sendMessage(msg.chat.id, "Меню", menuLinks);
    }
  } catch (e) {
    console.error(e);
  }
});

bot.on("callback_query", async (query) => {
  const { from, message, data } = query;
  try {
  } catch (e) {
    console.error(e);
  }
});
