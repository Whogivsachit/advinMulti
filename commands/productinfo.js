// Description: Specific product details
const { EmbedBuilder  } = require("discord.js");
const { CommandType } = require("wokcommands");
const { Stock } = require("../index.js");
require("dotenv/config");

module.exports = {
    category: "stock",
    aliases: ["product"],
    description: 'View specific product information',
    type: CommandType.SLASH,
    guildOnly: true,
    options: [
        {
            name: 'category',
            description: 'The Category you want to view.',
            required: true,
            type: 3,
            autocomplete: true,
        },
        {
            name: 'product',
            description: 'Select a product from the category',
            type: 3,
            required: true,
            autocomplete: true,
        }
    ],
    
    autocomplete: async (command, argument, interaction) => {
        const category = interaction.options.getString('category');
        if(category) {
            const products = await Stock.findAll({ where: { category: category } });
            return products.map((product) => {
                return { name: product.name, value: product.orderLink};
            });
        } else {
            const categories = await Stock.findAll({ attributes: ['category'], group: ['category'], });
            return categories.map((category) => {
                return { name: category.category, value: category.category};
            });
        }
      },

    callback: async ({ interaction }) => {
        const orderLink = interaction.options.getString('product');
        const product = await Stock.findOne({ where: { orderLink: orderLink } });
        if(!product) return interaction.reply({ embeds: [{ description: `Product not found`}], fetchReply: true });
        const createdAt = Math.floor(new Date(product.createdAt).getTime() / 1000);
        const updatedAt = Math.floor(new Date(product.updatedAt).getTime() / 1000);


        const embed = new EmbedBuilder()
        .setTitle(`Viewing Info For: **${product.category.split('-')[0]} -> ${product.name}**`)
        .setURL(`https://clients.advinservers.com${product.orderLink}`)
        .setTimestamp(new Date())
        .setDescription(`\`\`\`Price: $${product.price}\nIn Stock?: ${product.inStock ? "Yes" : "No"}\n${product.description}\`\`\`\nCreated At: <t:${createdAt}>\nLast Updated: <t:${updatedAt}>`)
        .setColor(5793266)
        .setFooter({
            text: process.env.PNAME,
            iconURL: process.env.LOGOURL
        })
        return interaction.reply({ embeds: [embed] });
    },
  }