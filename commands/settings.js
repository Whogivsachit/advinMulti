// Description: Edit settings related to this guild
const { PermissionsBitField  } = require("discord.js");
const { CommandType } = require("wokcommands");
const { Settings } = require("../index.js");
require("dotenv/config");

module.exports = {
    category: "settings",
    aliases: ["settings"],
    description: 'Set Specific settings',
    permissions: [PermissionsBitField.Flags.ManageGuild],
    type: CommandType.SLASH,
    guildOnly: true,
    options: [
        {
            name: "channel",
            description: "The channel to monitor stock in.",
            required: true,
            type: 3,
        },
        {
            name: "interval",
            description: "The interval to update the stock in.",
            required: true,
            type: 4,
        }
    ],

    callback: ({ guild, interaction }) => {
        const channelArg = interaction.options.getString('channel'); // Get the category argument
        const intervalArg = interaction.options.getInteger('interval'); // Get the category argument

        Settings.update({ stockmontiorchannel: channelArg, updateinterval: intervalArg }, { where: { guild: guild.id } });

        return interaction.reply({ embeds: [{ description: `Stock Monitor Channel set to ${channelArg} and update interval set to ${intervalArg}` }] });
    },
  }