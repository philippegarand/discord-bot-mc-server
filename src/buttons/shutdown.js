const { Buttons } = require("../enums");
const vm = require("../vm");

module.exports = {
  data: {
    name: Buttons.Shutdown,
  },
  async execute(interaction) {
    try {
      await vm.shutdown();
      await interaction.update({
        content: "Shutting down server...",
        components: [],
      });
      global.lastServerStart = Date.now();
      global.lastButton = Buttons.shutdownVM;
      global.setPressedButton(true);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
      await interaction.update({
        content: "Could not shutdown server...",
        components: [],
      });
    }
  },
};
