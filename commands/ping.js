// Description: Ping pong command
const { CommandType } = require("wokcommands");

module.exports = {
  category: "Fun",
  description: "Ping pong command",
  type: CommandType.SLASH,

  callback: ({ client, guild, interaction }) => {
    interaction.reply({ embeds: [{ description: `I'm still Alive`}], fetchReply: true });
  },
}