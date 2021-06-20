const { Telegraf } = require("telegraf");
const express = require("express");
const app = express();

const bot = new Telegraf(process.env.TELEGRAM_TOKEN);

bot.command("quit", (ctx) => {
  // Explicit usage
  ctx.telegram.leaveChat(ctx.message.chat.id);

  // Using context shortcut
  ctx.leaveChat();
});

// bot.on("text", (ctx) => {
//   // Explicit usage
//   ctx.telegram.sendMessage(
//     ctx.message.chat.id,
//     `Hello ${ctx.message.from.first_name}`
//   );

//   // Using context shortcut
//   //   ctx.reply(`Hello ${ctx.state.role}`);
//   console.log(ctx.message.from.first_name);
// });

bot.on("new_chat_members", (ctx) => {
  ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Hi ${ctx.message.new_chat_member.first_name}, Welcome to CCB family 🙏 Why don't you tell us about yourself`
  );
});
bot.on("left_chat_member", (ctx) => {
  console.log(ctx.message);
  ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Good bye ${ctx.message.left_chat_member.first_name}. We are sad to see you go 🙂`
  );
});

// bot.on("callback_query", (ctx) => {
//   // Explicit usage
//   ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

//   // Using context shortcut
//   ctx.answerCbQuery();
// });

// bot.on("inline_query", (ctx) => {
//   const result = [];
//   // Explicit usage
//   ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

//   // Using context shortcut
//   ctx.answerInlineQuery(result);
// });

bot.launch();
// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

module.exports = app;
