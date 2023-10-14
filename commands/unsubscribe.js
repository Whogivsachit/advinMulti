// Description: unsubscribe from a product
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
        const additions = [{ name: "All", value: "all" }];
        const subscriptionsOptions = subscriptions.map((subscription) => ({ name: `${subscription.category}-${subscription.name}`, value: subscription.orderLink }));
        return [...additions, ...subscriptionsOptions];
    },

    callback: async ({ interaction }) => {
        if(interaction.options.getString('product') === 'all') {
            await Subscriptions.destroy({ where: {userId: interaction.user.id} });
            return interaction.reply({ embeds: [{ description: `Your now unsubscribed from all products`}], fetchReply: true });
        }
        
        const orderLink = interaction.options.getString('product');
        const product = await Subscriptions.findOne({ where: { userId: interaction.user.id, orderLink: orderLink } });
        if(!product) return interaction.reply({ embeds: [{ description: `You're not subscribed to ${orderLink}`}], fetchReply: true });

        await Subscriptions.destroy({ where: { userId: interaction.user.id, orderLink: orderLink } });
        interaction.reply({ embeds: [{ description: `Your now unsubscribed to ${product.category}-${product.name}`}], fetchReply: true });
    }

}