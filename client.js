require("dotenv").config();
const { Client, REST, GatewayIntentBits, Routes, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require("discord.js");
const Discord = require("discord.js");
const client = new Client({
    intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildPresences ],
});
const { Client: FNBRClient } = require("fnbr");
const moment = require("moment");

// set bot to mobile
const { DefaultWebSocketManagerOptions: { identifyProperties } } = require("@discordjs/ws");
identifyProperties.browser = "Discord iOS";

// nigger bot
(async () => {
    // register commands
    async function registerCommands() {
        const rest = new REST().setToken(process.env.TOKEN);
        const commands = [
            {
                name: "login",
                description: "Login to your Epic Games account",
            },
        ];

        try {
            console.log("Registering commands...");
            await rest.put(Routes.applicationCommands("854516721385996328"), { body: commands });
            console.log("Commands registered!");
        } catch (err) {
            console.log("There was an error registering commands...");
            console.log(err);
        }
    }

    // error
    client.on("error", (err) => {
        console.log(err);
    });

    // handle interactions
    client.on("interactionCreate", async (interaction) => {
        if (interaction.isButton()) {
            if (interaction.customId === "inputAuthCodeBtn") {
                const loginModal = new ModalBuilder()
                    .setTitle("Login With Epic Games")
                    .setCustomId("inputAuthCodeModal")
                    .addComponents([
                        new ActionRowBuilder().addComponents(
                            new TextInputBuilder()
                                .setLabel("Code")
                                .setCustomId("inputAuthCodeInput")
                                .setStyle(TextInputStyle.Short)
                                .setRequired(true)
                        ),
                    ]);
                
                await interaction.showModal(loginModal);
            }
        }
        if (interaction.type === InteractionType.ModalSubmit) {
            if (interaction.customId === "inputAuthCodeModal") {
                await interaction.deferReply({ ephemeral: true });

                try {
                    const auth = interaction.fields.getTextInputValue("inputAuthCodeInput");
                    const fnbrclient = new FNBRClient({ auth: {
                        authorizationCode: auth
                    }});
                    await fnbrclient.login();

                    const payload = {};
                    const response = await fetch(`https://fngw-mcp-gc-livefn.ol.epicgames.com/fortnite/api/game/v2/profile/${fnbrclient.user.id}/client/QueryProfile?profileId=athena`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${fnbrclient.auth.auths.get("fortnite").token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(payload),
                    });
                    const user = await response.json();

                    const itemsCount = [];
                    for (const key in user.profileChanges[0].profile.items) {
                        if (Object.hasOwnProperty.call(user.profileChanges[0].profile.items, key)) {
                            const cosmetic = user.profileChanges[0].profile.items[key];
                            const id = cosmetic.templateId.split(":")[1];
                            itemsCount.push(cosmetic);
                            // try {
                            //     const response = await fetch(`https://fortnite-api.com/v2/cosmetics/br/search/ids?id=${id}`);
                            //     const cosmetics = await response.json();
                            //     console.log(cosmetics.data[0].name);
                            // } catch (err) {}
                        }
                    }

                    const infoEmbed = new EmbedBuilder()
                        .setTitle("Account Information")
                        .setDescription(`Account ID: \`${fnbrclient.user.id}\`
    Display Name: \`${fnbrclient.user.displayName}\`
    Display Name Changes: \`${fnbrclient.user.numberOfDisplayNameChanges}\`
    Created: \`${moment(user.profileChanges[0].profile.created).format("lll")}\`
    Last Login: \`${moment(fnbrclient.user.lastLogin).format("lll")}\`
    Email: \`${fnbrclient.user.email}\`
    Email Verified: \`${fnbrclient.user.emailVerified}\`
    2FA Enabled: \`${fnbrclient.user.tfaEnabled}\`
    First Name: \`${fnbrclient.user.name}\`
    Last Name: \`${fnbrclient.user.lastName}\`
    Country: \`${fnbrclient.user.country}\``)
                        .setTimestamp();

                    const statsEmbed = new EmbedBuilder()
                        .setTitle("Stats")
                        .setDescription(`Lifetime Wins: \`${user.profileChanges[0].profile.stats.attributes.lifetime_wins}\`
    Account Level: \`${user.profileChanges[0].profile.stats.attributes.accountLevel}\``)
                        .setTimestamp();

                    const seasonEmbed = new EmbedBuilder()
                        .setTitle(`Season ${user.profileChanges[0].profile.stats.attributes.season_num} Stats`)
                        .setDescription(`Level: \`${user.profileChanges[0].profile.stats.attributes.level}\``)
                        .setTimestamp();
                    
                    const skinsEmbed = new EmbedBuilder()
                        .setTitle(`All Cosmetics (${itemsCount.length})`)
                        .setImage()
                        .setTimestamp();

                    interaction.editReply({
                        content: `:white_check_mark: Successfully authenticated as \`${fnbrclient.user.displayName}\`!`,
                        embeds: [
                            infoEmbed,
                            statsEmbed,
                            seasonEmbed,
                            skinsEmbed,
                        ],
                    });
                } catch (err) {
                    interaction.editReply({
                        content: `Invalid Authorization Code!`,
                    });
                }
            }
        }
        if (!interaction.isChatInputCommand()) return;

        // login
        if (interaction.commandName === "login") {
            await interaction.deferReply({ ephemeral: true });

            const embed = new EmbedBuilder()
                .setThumbnail(`${client.user.avatarURL()}`)
                .setTitle("Login With Epic Games")
                .setDescription(`Click this [link](https://www.epicgames.com/id/api/redirect?clientId=3446cd72694c4a4485d81b77adbb2141&responseType=code)
Then click the button below to input your code
Keep in mind that the code will expire in 10 minutes`)
                .setTimestamp();
            
            const loginButton = new ButtonBuilder()
                .setLabel("Input Code")
                .setCustomId("inputAuthCodeBtn")
                .setStyle(ButtonStyle.Primary);

            const buttonRow = new ActionRowBuilder()
                .addComponents(loginButton);
            
            interaction.editReply({
                content: "",
                embeds: [
                    embed
                ],
                components: [
                    buttonRow
                ]
            });
        }
    });

    // ready
    client.on("ready", () => {
        console.log(`${client.user.username} is now connected to Discord!`);
        client.user.setActivity("Fortnite");
        registerCommands();
    });

    // login
    client.login(process.env.TOKEN);
})();