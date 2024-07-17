const TelegramApi = require("node-telegram-bot-api");
const api = "your_token";

const bot = new TelegramApi(api, { polling: true });

const chats = {};
const gameOptions = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: "1", callback_data: "1" },
        { text: "2", callback_data: "2" },
        { text: "3", callback_data: "3" },
        { text: "4", callback_data: "4" },
        { text: "5", callback_data: "5" },
      ],
      [
        { text: "6", callback_data: "6" },
        { text: "7", callback_data: "7" },
        { text: "8", callback_data: "8" },
        { text: "9", callback_data: "9" },
        { text: "0", callback_data: "0" }
      ]
    ],
  },
};

const againOption = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "Boshqatdan boshlash", callback_data: "/again" }],
    ],
  },
};

bot.setMyCommands([
  { command: "/start", description: "Boshlash" },
  { command: "/info", description: "Biz haqimizda" },
  { command: "/game", description: "O'yinni boshlash" },
]);

const startGame = async (chatID) => {
  await bot.sendMessage(chatID, "0 dan 9 gacha son o'yladim");
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatID] = randomNumber;
  return bot.sendMessage(chatID, "Sondi toping", gameOptions);
};

const start = () => {
  bot.on("message", (msg) => {
    const text = msg.text;
    const chatID = msg.chat.id;

    if (text === "/start") {
      bot.sendSticker(
        chatID,
        "https://sl.combot.org/hello_sticker_pacj/webp/1xf09f918b.webp"
      );
      return bot.sendMessage(chatID, "Assalomu alekum xush kelibsiz");
    }

    if (text === "/game") {
      return startGame(chatID);
    }

    if (text === "/info") {
      return bot.sendMessage(
        chatID,
        `Bu bot son topish o'yni uchun yaratilgan zerikanizda voqit o'tkisangiz bo'ladi😁  ${msg.from.first_name}`
      );
    }

    return bot.sendMessage(chatID, "Hech narsa topilmadi🤷‍♂️😢");
  });

  bot.on("callback_query", (callbackQuery) => {
    const data = callbackQuery.data;
    const chatID = callbackQuery.message.chat.id;

    if (data === "/again") {
      return startGame(chatID);
    }

    if (parseInt(data, 10) === chats[chatID]) {
      return bot.sendMessage(
        chatID,
        `Tabriklayman, siz to'g'ri sonni tanladingiz 😎👍🥳:  ${chats[chatID]}`
      );
    } else {
      return bot.sendMessage(
        chatID,
        `Siz topa olmadingiz, 🤥😢 to'g'ri son: ${chats[chatID]}`,
        againOption
      );
    }
  });
};

start();
