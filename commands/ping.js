// Description: Ping pong command
const { CommandType } = require("wokcommands");

module.exports = {
  category: "Fun",
  description: "Ping pong command",
  type: CommandType.SLASH,

  callback: async ({ client, guild, interaction }) => {
    const startTime = Date.now();
    const reply = await interaction.reply({
      embeds: [{ description: "Pinging..." }],
      fetchReply: true,
    });
    const endTime = Date.now();
    const ping = endTime - startTime;

    reply.edit({
      embeds: [
        {
          description: `Pong! Latency is ${ping}ms, API Latency is ${Math.round(
            client.ws.ping
          )}ms`,
        },
      ],
    });
  },
};
