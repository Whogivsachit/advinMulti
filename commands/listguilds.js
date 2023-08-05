// Description: Lists all guilds the bot is in.
const { CommandType } = require("wokcommands");

module.exports = {
  category: "Owner",
  aliases: ["listguilds"],
  description: 'List all the guilds the bot is in.',
  type: CommandType.SLASH,
  guildOnly: true,
  ownerOnly: true,

  callback: ({ client, guild, interaction }) => {
    const guilds = client.guilds.cache.map((guild) => {
      return `\`\`\`${guild.name} - ${guild.id}\n Members:${guild.memberCount}\n Owner: ${guild.ownerId}\`\`\``;
    });

    return {
        embeds: [{ description: `Guilds I've been forced to join: \n${guilds.join("\n")}`}]
    };
  },
}