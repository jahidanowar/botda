module.exports = (messages) => {
  const randomNumber = Math.floor(Math.random() * messages.length);
  return messages[randomNumber];
};
