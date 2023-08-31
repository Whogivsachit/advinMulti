// Description: List Subscribed Products
const { EmbedBuilder } = require("discord.js");
const { CommandType } = require("wokcommands");
const { Subscriptions } = require("../index.js");
require("dotenv/config");

module.exports = {
    category: "Stock",
    aliases: ["subscriptions", "subs"],
    description: 'List Subscribed Products',
    type: CommandType.SLASH,
    guildOnly: true,

    callback: async ({ interaction }) => {
        let subscriptions = await Subscriptions.findAll({ where: { userId: interaction.user.id } });
        if(subscriptions.length === 0) return interaction.reply({ embeds: [{ description: `You have no subscriptions.` }], fetchReply: true });

        const subscriptionString = subscriptions.map(subscription => `${subscription.category}-${subscription.name}`).join("\n");
        const embed = new EmbedBuilder()
            .setTitle(`Subscriptions`)
            .setDescription(subscriptionString)
            .setColor("#FF0000")
            .setTimestamp();

        interaction.reply({ embeds: [embed], fetchReply: true });

    }

}