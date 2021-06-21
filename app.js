const { Composer, Extra } = require("micro-bot");
const axios = require("axios");

// Message templates
const welcomeMessages = require("./src/welcomeMessages");
const goodByeMessages = require("./src/goodByeMessages");
const funnyMessages = require("./src/funnyMessages");
// Utility functions
const randomMessage = require("./utils/selectRandomMessage");
const createMessage = require("./utils/createMessage");
const numberToMillion = require("./utils/numberToMillion");

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
    const coindata = await axios.get(
      "https://api.coincap.io/v2/assets?limit=10"
    );

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

module.exports = bot;
