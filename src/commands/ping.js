const { SlashCommandBuilder } = require("discord.js");
const { Commands } = require("../enums");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(Commands.Ping)
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    return interaction.editReply("Pong!");
  },
};
