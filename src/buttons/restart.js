const { Buttons } = require("../enums");
const vm = require("../vm");

module.exports = {
  data: {
    name: Buttons.Restart,
  },
  async execute(interaction) {
    try {
      await vm.restart();
      await interaction.update({
        content: "Restarting server...",
        components: [],
      });
      global.lastServerStart = Date.now();
      global.lastButton = Buttons.Restart;
      global.setPressedButton(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      await interaction.update({
        content: "Could not restart...",
        components: [],
      });
    }
  },
};
