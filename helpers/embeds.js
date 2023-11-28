const { EmbedBuilder } = require("discord.js");
const moment = require("moment");

// login
async function loginEmbedded() {
    const loginEmbed = new EmbedBuilder()
        .setTitle("Login With Epic Games")
        .setDescription(`Click this [link](https://www.epicgames.com/id/api/redirect?clientId=3446cd72694c4a4485d81b77adbb2141&responseType=code)
Then click the button below to input your code
Keep in mind that the code will expire in 10 minutes`)
        .setTimestamp();

    return loginEmbed;
}

// bot info
async function botInfoEmbedded(client) {
    const botInfoEmbed = new EmbedBuilder()
        .setTitle("Bot Information")
        .setThumbnail(`${client.user.avatarURL()}`)
        .addFields(
            {
                name: "Servers",
                value: `${client.guilds.cache.size}`,
                inline: true,
            },
            {
                name: "Users",
                value: `${client.users.cache.size}`,
                inline: true,
            },
            {
                name: "Ping",
                value: `${client.ws.ping}ms`,
                inline: true,
            },
            {
                name: "Last Restarted",
                value: `<t:${Math.floor(client.readyTimestamp / 1000)}:R>`,
                inline: true,
            },
            {
                name: "GitHub",
                value: "[Click Me!](https://github.com/FishySkinChecker/discord-bot)",
                inline: true,
            },
            {
                name: "Support Server",
                value: "[Click Me!](https://discord.gg/dAeFbHCtrp)",
                inline: true,
            },
        )
        .setTimestamp();

    return botInfoEmbed;
}

// info
async function infoEmbedded(fnbrclient, user) {
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
    
    return infoEmbed;
}

// stats
async function statsEmbedded(user) {
    const statsEmbed = new EmbedBuilder()
        .setTitle("Stats")
        .setDescription(`Lifetime Wins: \`${user.profileChanges[0].profile.stats.attributes.lifetime_wins}\`
Account Level: \`${user.profileChanges[0].profile.stats.attributes.accountLevel}\``)
        .setTimestamp();

    return statsEmbed;
}

// season stats
async function seasonEmbedded(user) {
    const seasonEmbed = new EmbedBuilder()
        .setTitle(`Season ${user.profileChanges[0].profile.stats.attributes.season_num} Stats`)
        .setDescription(`Level: \`${user.profileChanges[0].profile.stats.attributes.level}\``)
        .setTimestamp();

    return seasonEmbed;
}

// skins
async function skinsEmbedded(itemsCount) {
    const skinsEmbed = new EmbedBuilder()
        .setTitle(`All Cosmetics (${itemsCount.length})`)
        .setImage()
        .setTimestamp();

    return skinsEmbed;
}

module.exports = {
    loginEmbedded,
    botInfoEmbedded,
    infoEmbedded,
    statsEmbedded,
    seasonEmbedded,
    skinsEmbedded,
};