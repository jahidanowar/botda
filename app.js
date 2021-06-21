const { Composer } = require("micro-bot");
// Message templates
const welcomeMessages = require("./src/welcomeMessages");
const goodByeMessages = require("./src/goodByeMessages");
// Utility functions
const randomMessage = require("./utils/selectRandomMessage");
const createMessage = require("./utils/createMessage");

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

module.exports = bot;
