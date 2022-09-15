const { Buttons } = require("../enums");
const vm = require("../vm");

module.exports = {
  data: {
    name: Buttons.Start,
  },
  async execute(interaction) {
    try {
      await vm.start();
      await interaction.update({
        content: "Starting up server...",
        components: [],
      });
      global.lastServerStart = Date.now();
      global.lastButton = Buttons.Start;
      global.setPressedButton(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      await interaction.update({
        content: "Could not start server...",
        components: [],
      });
    }
  },
};
