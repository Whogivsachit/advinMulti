const { Client, EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { CommandType, CooldownTypes } = require("wokcommands");
const { Stock, Subscriptions } = require("../index.js");
require("dotenv/config");

module.exports = {
    category: "Stock",
    aliases: ["subscribe", "notify", "sub"],
    description: 'Subscribe to receive notifications for a product',
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
        const Subscription = await Subscriptions.findOne({ where: { userId: interaction.user.id, orderLink: product.orderLink } });

        if (Subscription) {
            interaction.reply({ embeds: [{ description: `You're already subscribed to ${product.category}-${product.name}`}], fetchReply: true });
        } else {
            await Subscriptions.create({ 
                userId: interaction.user.id, 
                category: product.category, 
                name: product.name, 
                orderLink: product.orderLink });
            interaction.reply({ embeds: [{ description: `Your now subscribed to ${product.category}-${product.name}`}], fetchReply: true });
        }
    },
  }