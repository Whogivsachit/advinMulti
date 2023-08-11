// Description: Update stock embed every 2 minutes
// Static file for the channelEmbed feature

const { Client, EmbedBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv/config");
const { Stock, Settings } = require("../index.js");
module.exports = async (instance, client) => {

    // Globals
    const settings = await Settings.findOne({ where: { guild: "823715598336786443"} });
    const guildN = await client.guilds.fetch(settings.guild);
    const channelToSend = await guildN.channels.fetch(settings.stockmontiorchannel);

    async function updateEmbed() {
	  const timeFormat = `<t:${Math.floor(new Date().getTime() / 1000)}>`;
    const embed = new EmbedBuilder()
    .setColor("#FF0000")
    .setDescription(`Current Stock for Advinservers Products\n If a product is in stock you can click the blue to order\n\n Last Update: ${timeFormat}`)
    .setTitle("AdvinServers Current Stock")
    .setTimestamp(new Date());

        const products = await Stock.findAll();
        const categories = Array.from(new Set(products.map((product) => product.category)));

        categories.forEach((category) => {
            const productsInCategory = products.filter((product) => product.category === category).map((product) => 
            `${product.inStock ? `[${product.name}](https://clients.advinservers.com${product.orderLink})` : `${product.name}`}: $${product.price}`); // Get the products in the category and format them     
            
            if (productsInCategory.length > 0) { // If there are products in the category, add them to the embed
              embed.addFields({
                name: `**${category.replace(/-/g, ' ')}**`,
                value: productsInCategory.join('\n'),
              });
            }
          });

        channelToSend.messages.fetch({ limit: 1 }).then(messages => {
          const lastMessage = messages.first();
          if(!lastMessage) return channelToSend.send({ embeds: [embed] });
          if(lastMessage.author.id === client.user.id) {
              lastMessage.edit({ embeds: [embed] });
          } else {
              channelToSend.send({ embeds: [embed] });
          }
        });
    }

    updateEmbed();
    setInterval(updateEmbed, process.env.UPDATEINTERVAL);
};