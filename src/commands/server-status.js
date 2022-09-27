const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
} = require("discord.js");
const {
  Buttons,
  Commands,
  ServerStatus,
  VMPowerStateToServerStatus,
} = require("../enums");
const { getVMPowerStateToServerStatus } = require("../vm");
require("dotenv").config();

const mcServerUtil = require("minecraft-server-util");

const { MC_SERVER_ADRESS } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName(Commands.ServerStatus)
    .setDescription("Display the server's current status"),
  async execute(interaction) {
    let vmServerStatus =
      VMPowerStateToServerStatus[await getVMPowerStateToServerStatus()];

    let mcServerStatus;
    let nbOfConnectedPlayers = "";
    if (vmServerStatus === ServerStatus.Up) {
      try {
        mcServerStatus = await mcServerUtil.status(MC_SERVER_ADRESS, 25565, {
          timeout: 5000,
        });
        nbOfConnectedPlayers = `${mcServerStatus.players.online}/${mcServerStatus.players.max} connected players.`;
      } catch (error) {
        mcServerStatus = ServerStatus.Unknown;
      }
    }

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(Buttons.Start)
        .setLabel(Buttons.Start)
        .setStyle(ButtonStyle.Primary)
        .setDisabled(
          vmServerStatus === ServerStatus.Up ||
            vmServerStatus === ServerStatus.Starting ||
            vmServerStatus === ServerStatus.ShuttingDown ||
            vmServerStatus === ServerStatus.Restarting
        ),
      new ButtonBuilder()
        .setCustomId(Buttons.Shutdown)
        .setLabel(Buttons.Shutdown)
        .setStyle(ButtonStyle.Danger)
        .setDisabled(
          vmServerStatus === ServerStatus.Down ||
            vmServerStatus === ServerStatus.Starting ||
            vmServerStatus === ServerStatus.ShuttingDown ||
            vmServerStatus === ServerStatus.Restarting
        ),
      new ButtonBuilder()
        .setCustomId(Buttons.Restart)
        .setLabel(Buttons.Restart)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(
          vmServerStatus === ServerStatus.Starting ||
            vmServerStatus === ServerStatus.ShuttingDown ||
            vmServerStatus === ServerStatus.Down ||
            vmServerStatus === ServerStatus.Restarting
        )
    );

    let message = `VM Server is: **${vmServerStatus}**.`;
    if (nbOfConnectedPlayers) message += `\n${nbOfConnectedPlayers}`;
    if (vmServerStatus === ServerStatus.Starting)
      message += `\nMC Server should start shortly`;
    if (vmServerStatus === ServerStatus.ShuttingDown)
      message += `\nPlease wait for it to be completly down before doing another action`;
    if (vmServerStatus === ServerStatus.Restarting)
      message += `\nPlease wait for it to be completly restarted before doing another action`;
    if (mcServerStatus === ServerStatus.Unknown) {
      // 5 min
      if (Date.now() - global.lastServerStart > 5 * 60 * 1000) {
        message += `\nMC Server is probably crashed`;
        message += `\nTry restarting the server`;
      } else {
        message += `\nMC Server is probably booting up`;
        message += `\nIf it isn't up in 2-3 minutes, there may be something wrong`;
      }
    }

    interaction.editReply({
      content: message,
      components: [row],
    });

    setTimeout(function () {
      if (global.pressedButton) {
        global.setPressedButton(false);
        return;
      }

      // no button got pressed, remove them
      interaction.editReply({
        content: message,
        components: [],
      });

      global.setPressedButton(false);
    }, 10000);
  },
};
