// Description: Shows bot specific information.
const { Client, EmbedBuilder } = require("discord.js");
const { CommandType } = require("wokcommands");
require("dotenv/config");

module.exports = {
    category: "Info",
    aliases: ["botinfo", "info"],
    description: 'Shows bot specific information.',
    type: CommandType.BOTH,
    guildOnly: true,

    callback: ({ client, guild }) => {
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTimestamp()
            .setThumbnail("https://media.discordapp.net/attachments/1099249885074702358/1101204366884602006/Mainlogo.png")
            .setTitle(`${process.env.PNAME} Information`)
            .addFields(
                { name: `Version`, value: `A1`, inline: true },
                { name: `Library`, value: `Discord.js`, inline: true },
                { name: `Creator`, value: `Whogi`, inline: true },
                { name: `Servers`, value: `${client.guilds.cache.size}`, inline: true },
                { name: `Users`, value: `${guild.memberCount}`, inline: true },
                { name: `Website`, value: `[Chitterengine](https://chitterengine.com)`, inline: true }
            )
            .setFooter({
                text: `${process.env.PNAME} Information`,
                iconURL: "https://media.discordapp.net/attachments/1099249885074702358/1101204366884602006/Mainlogo.png"
            })

        return {
            embeds: [embed]
        };
    },
  }