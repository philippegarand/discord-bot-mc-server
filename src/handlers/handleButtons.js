const { readdirSync } = require("fs");

module.exports = (client) => {
  client.handleButtons = async () => {
    const buttonFiles = readdirSync("./src/buttons");

    const { buttons } = client;

    for (const file of buttonFiles) {
      const button = require(`../buttons/${file}`);
      buttons.set(button.data.name, button);
    }
  };
};
