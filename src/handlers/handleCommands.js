const { readdirSync } = require("fs");

module.exports = (client) => {
  client.handleCommands = async () => {
    const commandFiles = readdirSync("./src/commands");

    const { commands } = client;

    for (const file of commandFiles) {
      const command = require(`../commands/${file}`);
      commands.set(command.data.name, command);
    }
  };
};
