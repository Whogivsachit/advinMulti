// Description: its just a blahaj command
const { Client, EmbedBuilder } = require("discord.js");
const { CommandType } = require("wokcommands");

module.exports = {
  category: "Fun",
  aliases: ["blahaj", "blah"],
  description: "Blahaj!",
  type: CommandType.SLASH,

  callback: async ({ client, guild, interaction }) => {

    const blahaj = [
        "https://cdn.discordapp.com/attachments/355507232894484492/1137147333537190039/blahaj.gif",
        "https://media.tenor.com/yiO4tNS5CtkAAAAC/blahaj.gif",
        "https://media.tenor.com/JpairZOomiEAAAAM/bl%C3%A5haj-ikea-shark.gif",
        "https://media.tenor.com/NpyBsaAUbPoAAAAM/ikea-blahaj.gif",
        "https://media.tenor.com/zgfNmnOdBDYAAAAM/blahaj-blahaj-gaming.gif",
        "https://media.tenor.com/YpHDXzEmkuMAAAAM/anime-girl-anime.gif",
        "https://media.tenor.com/fojvF1KWlMUAAAAC/pewdiepie-nword.gif"]
    
    const randomBlahaj = blahaj[Math.floor(Math.random() * blahaj.length)]

    const embed = new EmbedBuilder()
    .setColor(0xFF0000)
    .setTimestamp()
    .setTitle("Blahaj!")
    .setImage(`${randomBlahaj}`)
    .setFooter({
        text: process.env.PNAME,
        iconURL: process.env.LOGOURL
    })

    interaction.reply({ embeds: [ embed ], fetchReply: true });// Send loading embed
  },
}