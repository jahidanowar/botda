module.exports = (message, name, group) => {
  let output = message.replace(/{name}/g, name);
  output = output.replace(/{group}/g, group);
  return output;
};
