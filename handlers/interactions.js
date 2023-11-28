const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require("discord.js");
const { Client: FNBRClient } = require("fnbr");
const { loginEmbedded, infoEmbedded, statsEmbedded, seasonEmbedded, skinsEmbedded } = require("../helpers/embeds");

async function handleInteractions(interaction) {
    // buttons
    if (interaction.isButton()) {
        // login button
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

    // modals
    if (interaction.type === InteractionType.ModalSubmit) {
        // login modal
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

                interaction.editReply({
                    content: `:white_check_mark: Successfully authenticated as \`${fnbrclient.user.displayName}\`!`,
                    embeds: [
                        (await infoEmbedded(fnbrclient, user)),
                        (await statsEmbedded(user)),
                        (await seasonEmbedded(user)),
                        (await skinsEmbedded(itemsCount)),
                    ],
                });
            } catch (err) {
                interaction.editReply({
                    content: `Invalid Authorization Code!`,
                });
            }
        }
    }

    // check if command
    if (!interaction.isChatInputCommand()) return;

    // login command
    if (interaction.commandName === "login") {
        await interaction.deferReply({ ephemeral: true });
                
        const loginButton = new ButtonBuilder()
            .setLabel("Input Code")
            .setCustomId("inputAuthCodeBtn")
            .setStyle(ButtonStyle.Primary);
    
        const buttonRow = new ActionRowBuilder()
            .addComponents(loginButton);
                
        interaction.editReply({
            content: "",
            embeds: [
                (await loginEmbedded()),
            ],
            components: [
                buttonRow
            ]
        });
    }
}

module.exports = {
    handleInteractions,
};