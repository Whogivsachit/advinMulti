// Description: Uwuifies some text
const { CommandType } = require("wokcommands");
module.exports = {
  category: "Fun",
  aliases: ["uwu","^v^"],
  description: "Uwuify",
  type: CommandType.SLASH,
  options: [
    {
      name: 'message',
      description: 'The message you want to uwuify?',
      type: 3,
      required: true,
    },
  ],
  callback: async ({ interaction }) => {
    await interaction.deferReply()
    
    const getRandomUwuFace = () => {
      const uwuFaces = ['(・`ω´・)', ';;w;;', 'owo', 'UwU', '>w<', '^w^'];
      return uwuFaces[Math.floor(Math.random() * uwuFaces.length)];
    };

    let text = interaction.options.getString('message');
    text = text.replace(/(?:r|l)/gi, 'w');
    text = text.replace(/(?:ove)/gi, 'uv');
    text = text.replace(/n([aeiou])/gi, 'ny$1');
    text += ' ' + getRandomUwuFace();
  
    interaction.editReply({ embeds: [{ description: text}], fetchReply: true });
  },
}
