// Description: When the bot joins a guild, log it to the console.
const { Client, EmbedBuilder } = require("discord.js");
const { CommandType, CooldownTypes } = require("wokcommands");
const { Settings } = require("../../index.js");
module.exports = (guild) => {
    console.log(`[GUILD JOIN] ${guild.name} (${guild.id}) added the bot.`);
    Settings.create({
        guild: guild.id,
        botname: "AdvinServers Stock",
        stockmontiorchannel: "none",
        updateinterval: 0,
    });
};
