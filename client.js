require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences ],
});
const { handleReady } = require("./handlers/ready");
const { handleInteractions } = require("./handlers/interactions");

// set bot to mobile
const { DefaultWebSocketManagerOptions: { identifyProperties } } = require("@discordjs/ws");
identifyProperties.browser = "Discord iOS";

// bot
(async () => {
    // handle interactions
    client.on("interactionCreate", (interaction) => handleInteractions(interaction));

    // ready
    client.on("ready", () => handleReady(client));

    // login
    client.login(process.env.TOKEN);
})();