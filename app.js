const { Composer, Extra } = require("micro-bot");
const axios = require("axios");
const { format } = require("date-fns");

// Message templates
const welcomeMessages = require("./src/welcomeMessages");
const goodByeMessages = require("./src/goodByeMessages");
const funnyMessages = require("./src/funnyMessages");
// Utility functions
const randomMessage = require("./utils/selectRandomMessage");
const createMessage = require("./utils/createMessage");
const numberToMillion = require("./utils/numberToMillion");

const TOP_API = "https://api.coincap.io/v2/assets?limit=10";
const STATUS_API = "https://api.alternative.me/fng/";
const STATUS_IMG = "https://alternative.me/crypto/fear-and-greed-index.png";

// Bot instance
const bot = new Composer();

// Greet New members
bot.on("new_chat_members", (ctx) => {
  const messageTemplate = randomMessage(welcomeMessages);
  const message = createMessage(
    messageTemplate,
    ctx.message.new_chat_member.first_name,
    "CCB"
  );
  ctx.telegram.sendMessage(ctx.message.chat.id, message);
});

// Say good bye to leaving members
bot.on("left_chat_member", (ctx) => {
  const messageTemplate = randomMessage(goodByeMessages);
  const message = createMessage(
    messageTemplate,
    ctx.message.left_chat_member.first_name,
    "CCB"
  );
  ctx.telegram.sendMessage(ctx.message.chat.id, message);
});

//Menu
bot.start(async (ctx) => {
  console.log(ctx.message.from, ctx.message.chat);
  const message = `/top - Top 10 Cryptocurrencies\n/status - Fear and Greed Index`;
  await ctx.reply(message);
});

// Leave chat
bot.command("quit", (ctx) => {
  // Explicit usage
  ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  ctx.leaveChat();
});

// Get shows top 10 crypto
bot.command("top10", async (ctx) => {
  try {
    const coindata = await axios.get(TOP_API);

    let message = randomMessage(funnyMessages);

    message += `\n*Name* -> *Price* -> *MarketCap*\n`;
    coindata.data.data.forEach((coin, i) => {
      message += `*${i + 1}* ${coin.symbol} -> $${parseFloat(
        coin.priceUsd
      ).toFixed(2)} -> $${numberToMillion(parseInt(coin.marketCapUsd))}\n`;
    });
    message += ``;

    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      message,
      Extra.markdown(true)
    );
  } catch (err) {
    ctx.telegram.sendMessage(
      "Why do you have to be so lazy? 😖 Just go to an exchange and check it yourself😡"
    );
  }
});

// Get Greed Index
bot.command("status", async (ctx) => {
  try {
    const randomNumber = Math.round(Math.random() * 100) + Date.now();

    const { data } = await axios.get(STATUS_API);

    let message = `Greed Index -> *${data.data[0].value_classification}*\n`;
    message += `Updated on: ${format(
      new Date(data.data[0].timestamp * 1000),
      "MMMM dd"
    )}`;

    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      message,
      Extra.markdown(true)
    );
    ctx.telegram.sendPhoto(
      ctx.message.chat.id,
      `${STATUS_IMG}?status=${randomNumber}`
    );
  } catch (err) {
    console.log(err);
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Sorry yar🥲! The service is down now."
    );
  }
});

module.exports = bot;
