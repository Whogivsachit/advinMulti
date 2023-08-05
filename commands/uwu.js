// Description: Ping pong command
const { CommandType } = require("wokcommands");

module.exports = {
  category: "Fun",
  aliases: ["uwu","^v^"],
  description: "Uwuify",
  type: CommandType.SLASH,
  options: [
    {
      name: 'message',
      description: 'The message you want to uwuify',
      type: 3,
      required: true,
    },
  ],
  callback: async ({ client, guild, interaction }) => {
    await interaction.deferReply()
    let text = interaction.options.getString('message')
    const getRandomUwuFace = () => {
        const uwuFaces = ['(・`ω´・)', ';;w;;', 'owo', 'UwU', '>w<', '^w^']
        return uwuFaces[Math.floor(Math.random() * uwuFaces.length)]
      }
  
      text = text.replace(/(?:r|l)/g, 'w')
      text = text.replace(/(?:R|L)/g, 'W')
      text = text.replace(/n([aeiou])/g, 'ny$1')
      text = text.replace(/N([aeiou])/g, 'Ny$1')
      text = text.replace(/ove/g, 'uv')
      text = text + ' ' + getRandomUwuFace()
  
      interaction.editReply({ embeds: [{ description: text}], fetchReply: true });// Send loading embed
  },
}