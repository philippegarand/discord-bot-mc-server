# discord-bot-mc-server

Simple Discord bot to manage a Minecraft server hosted on an Azure vm.

Made with `Discord.js` 💙

# Getting started

## Prerequisites

- npm
- node
- Azure VM with :
  - Proper setup to host a Minecraft server ([example setup](https://learn.microsoft.com/en-us/gaming/azure/reference-architectures/multiplayer-basic-game-server-hosting))
  - A way to be connected in Azure
    - The bot is using `DefaultAzureCredential()` from the [Azure Identity client library](https://learn.microsoft.com/en-us/javascript/api/overview/azure/identity-readme?view=azure-node-latest) for JS, which try these in order:
      - EnvironmentCredential
      - ManagedIdentityCredential
      - VisualStudioCodeCredential
      - AzureCliCredential
      - AzurePowerShellCredential
  - Startup script to start the actual Minecraft server, like using `crontab` with `"@reboot xxxx"`

## Installation

1. Install dependencies
   ```
   npm install
   ```
2. Create and add a bot on your Discord server ([how to?](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#adding-your-bot-to-servers))
3. Create a `.env` file based on `.env.template`
   - **DISCORD_TOKEN** : Client Secret from your Discord application OAuth2 page
   - **DISCORD_CLIENT_ID** : Client ID from your Discord application OAuth2 page
   - **DISCORD_GUILD_ID** : with developer mode activated on Discord, right-click the server you want to add the bot and copy the ID
   - **DISCORD_BOT_CHANNEL_NAME** : the channel in which the bot will live
   - **AZURE_SUBSCRIPTION_ID** : the Azure subscription Id
   - **AZURE_RESOURCE_GROUP** : the Azure resource group of the VM
   - **AZURE_VM_NAME** : the Azure VM name
   - **MC_SERVER_ADRESS** : the Minecraft server adress
   - **MC_SERVER_NO_PLAYERS_CRON** : a cron expression used to check if there are connected players on the server. Ex.: _/15 _ \* \* \* (will check every 15 minutes)
   - **MC_SERVER_NO_PLAYERS_TIMES_FOR_SHUTDOWN** : after how many cron execution without connected players should the bot shutdown the VM. Ex.: 2
   - **MC_SERVER_NO_PLAYERS_SHUTDOWN_MSG** : The message the bot should send to warn that it is shutting down the VM. Ex.: with the values provided above : _No connected players since about 30 minutes, shutting down server_
4. Deploy the slash commands to the Discord server
   ```
   node src/deploy-commands.js
   ```
   - If you ever need to remove all the slash commands, you can run this
     ```
     node src/delete-commands.js
     ```
5. Start the bot
   ```
   node .
   ```
6. You can now use the `/server-status` command to manage your VM hosting a Minecraft server!
