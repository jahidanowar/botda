const { Telegraf } = require("telegraf");
const express = require("express");
const app = express();

const welcomeMessages = require("./src/welcomeMessages");

const randomMessage = () => {
  const randomNumber = Math.floor(Math.random() * welcomeMessages.length);
  return welcomeMessages[randomNumber];
};

const createMessage = (message, name, group) => {
  let output = message.replace(/{name}/g, name);
  output = output.replace(/{group}/g, group);
  return output;
};

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

// Greet New members
bot.on("new_chat_members", (ctx) => {
  const messageTemplate = randomMessage();
  const message = createMessage(
    messageTemplate,
    ctx.message.new_chat_member.first_name,
    "CCB"
  );
  ctx.telegram.sendMessage(ctx.message.chat.id, message);
});

// Say good bye to leaving members
bot.on("left_chat_member", (ctx) => {
  console.log(ctx.message);
  ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Good bye ${ctx.message.left_chat_member.first_name}. We are sad to see you go 🙂`
  );
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
