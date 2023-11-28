const { REST, Routes } = require("discord.js");

// register commands
async function registerCommands() {
    const rest = new REST().setToken(process.env.TOKEN);
    const commands = [
        {
            name: "login",
            description: "Login to your Epic Games account",
        },
        {
            name: "bot_info",
            description: "Information about the bot",
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

// client ready
async function handleReady(client) {
    console.log(`${client.user.username} is now connected to Discord!`);
    client.user.setActivity("Fortnite");
    registerCommands();
}

module.exports = {
    handleReady,
};