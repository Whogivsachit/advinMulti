// Description: Show general information about the stock.
const { EmbedBuilder  } = require("discord.js");
const { CommandType } = require("wokcommands");
const { Stock } = require("../index.js");
require("dotenv/config");

module.exports = {
    category: "stock",
    aliases: ["stockinfo", "stockinformation"],
    description: 'View information about stock',
    type: CommandType.SLASH,
    guildOnly: true,

    callback: async ({ guild, interaction }) => {
        const products = await Stock.findAll();
        const categories = await Stock.findAll({ attributes: ['category'], group: ['category'] });
        const inStock = products.filter(product => product.inStock);
        const outOfStock = products.filter(product => !product.inStock);
        const percentInStock = Math.round((inStock.length / products.length) * 100);
        const percentOutOfStock = Math.round((outOfStock.length / products.length) * 100);
        
        const embed = new EmbedBuilder()
            .setTitle("Stock Information")
            .setDescription(`Wow thats a lot of out of stock products. What a shame\n 
            **Totals:** ${products.length} Produts | ${categories.length} Categories
            **Products:** ${inStock.length}/${outOfStock.length} In Stock 
            **Percentages:** ${percentInStock}% (${percentOutOfStock}% OOS)`)
            .setTimestamp();

        return interaction.reply({ embeds: [embed]});
    },
  }