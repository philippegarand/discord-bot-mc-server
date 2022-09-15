const fs = require("fs");
const {
  Client,
  Collection,
  GatewayIntentBits,
  EmbedBuilder,
} = require("discord.js");
const cron = require("node-cron");
const vm = require("./vm");
const mcServerUtil = require("minecraft-server-util");
const { ServerStatus } = require("./enums");
require("dotenv").config();

const {
  DISCORD_TOKEN,
  MC_SERVER_ADRESS,
  MC_SERVER_NO_PLAYERS_CRON,
  MC_SERVER_NO_PLAYERS_SHUTDOWN_MSG,
  MC_SERVER_NO_PLAYERS_TIMES_FOR_SHUTDOWN,
} = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

global.lastServerStart;
global.pressedButton = false;
global.setPressedButton = (state) => {
  global.pressedButton = state;
};

client.commands = new Collection();
client.buttons = new Collection();

client.once("ready", () => {
  // eslint-disable-next-line no-console
  console.log("Bot is ready!");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await interaction.deferReply();
    await command.execute(interaction);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    await interaction.editReply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  const button = client.buttons.get(interaction.customId);
  if (!button) return;

  try {
    await button.execute(interaction);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this button!",
      ephemeral: true,
    });
  }
});

const handlerFiles = fs.readdirSync("./src/handlers");
for (const file of handlerFiles) {
  require(`./handlers/${file}`)(client);
}

global.vmServerStatus;
let timesNoPlayers = 0;
cron.schedule(MC_SERVER_NO_PLAYERS_CRON, async () => {
  if (global.vmServerStatus !== ServerStatus.Up) return;

  try {
    const mcServerStatus = await mcServerUtil.status(MC_SERVER_ADRESS, 25565, {
      timeout: 5000,
    });

    timesNoPlayers = mcServerStatus.players.online > 0 ? 0 : timesNoPlayers + 1;
  } catch (error) {
    timesNoPlayers++;
  }

  if (timesNoPlayers >= MC_SERVER_NO_PLAYERS_TIMES_FOR_SHUTDOWN) {
    await vm.shutdown();
    timesNoPlayers = 0;
    const channel = client.channels.cache.find(
      (channel) => channel.name === "mc"
    );

    const exampleEmbed = new EmbedBuilder()
      .setColor(0xd83c3e)
      .setDescription(MC_SERVER_NO_PLAYERS_SHUTDOWN_MSG);

    channel.send({ embeds: [exampleEmbed] });
  }
});

client.handleCommands();
client.handleButtons();

client.login(DISCORD_TOKEN);
