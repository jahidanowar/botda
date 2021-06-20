const { Telegraf } = require("telegraf");
const express = require("express");
const app = express();

const welcomeMessages = require("./src/welcomeMessages");
const goodByeMessages = require("./src/goodByeMessages");

const randomMessage = (messages) => {
  const randomNumber = Math.floor(Math.random() * messages.length);
  return messages[randomNumber];
};

const createMessage = (message, name, group) => {
  let output = message.replace(/{name}/g, name);
  output = output.replace(/{group}/g, group);
  return output;
};

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

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

bot.launch();
// // Enable graceful stop
// process.once("SIGINT", () => bot.stop("SIGINT"));
// process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = app;
