const { EmbedBuilder } = require("discord.js");
const { CommandType } = require("wokcommands");
const { Subscriptions } = require("../index.js");
require("dotenv/config");

module.exports = {
    category: "Stock",
    aliases: ["unsubscribe", "deletesub", "unsub", "removesub"],
    description: 'unsubscribe from a product',
    type: CommandType.SLASH,
    guildOnly: true,
    options: [
        {
            name: 'product',
            description: 'Select a product from the category',
            type: 3,
            required: true,
            autocomplete: true,
        }
    ],

    autocomplete: async (command, argument, interaction) => {
        const subscriptions = await Subscriptions.findAll({ where: { userId: interaction.user.id } });
        return subscriptions.map((subscription) => {
            return { name: `${subscription.category}-${subscription.name}`, value: subscription.orderLink};
        });
    },

    callback: async ({ interaction }) => {
        const orderLink = interaction.options.getString('product');
        const product = await Subscriptions.findOne({ where: { userId: interaction.user.id, orderLink: orderLink } });
        if(!product) return interaction.reply({ embeds: [{ description: `You're not subscribed to ${orderLink}`}], fetchReply: true });

        await Subscriptions.destroy({ where: { userId: interaction.user.id, orderLink: orderLink } });
        interaction.reply({ embeds: [{ description: `Your now unsubscribed to ${product.category}-${product.name}`}], fetchReply: true });
    }

}