// Description: Echos out a message
const { CommandType } = require("wokcommands");

module.exports = {
  category: "Owner",
  aliases: ["say"],
  description: 'Echos a message out into the specified channel.',
  type: CommandType.SLASH,
  guildOnly: true,
  ownerOnly: true,
  options: [
    {
        name: "channel",
        description: "The channel to send the message to",
        required: true,
        type: 7,
    },
    {
        name: "message",
        description: "The message to send",
        required: true,
        type: 3,
    },
    {
        name: "embed",
        description: "Sends the message as a Discord embed",
        required: false,
        type: 5,
    }
],

  callback: ({ client, guild, interaction }) => {
    var type = interaction.options.getBoolean('embed');
    const channel = interaction.options.getChannel('channel');
    const message = interaction.options.getString('message');
    if(type == null) type = true;

    type ? channel.send({ embeds: [{ description: message}]}) : channel.send(message);
    interaction.reply({ embeds: [{ description: `Sent message to ${channel}. Embed: ${type}`}], ephemeral: true });

  },
}
