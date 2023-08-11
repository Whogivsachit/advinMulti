const { Client, IntentsBitField, Partials, REST, Routes, ActivityType } = require("discord.js");
const WOK = require('wokcommands');
const path = require('path');
const chalk = require('chalk');
const Sequelize = require('sequelize');
require("dotenv/config");

// Sequelize Database
const sequelize = new Sequelize(process.env.DB, process.env.DBUSER, process.env.DBPASS,{
    host: process.env.DBHOST,
    port: process.env.DBPORT,
    dialect: 'mysql',
    logging: false,
    define: {
        timestamps: false
    }
});

// Models for Sequelize
const Stock = require('./models/stock')(sequelize, Sequelize.DataTypes);
const Subscriptions = require('./models/subscriptions')(sequelize, Sequelize.DataTypes);
const Settings = require('./models/settings')(sequelize, Sequelize.DataTypes);

// Create a new client instance
const client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds,
      IntentsBitField.Flags.GuildMessages,
      IntentsBitField.Flags.DirectMessages,
      IntentsBitField.Flags.MessageContent,
    ],
    partials: [Partials.Channel],
    presence: {
      status: "online",
      activities: [ { name: "AdvinServers Stock", type: ActivityType.Watching, url: "https://advinservers.com"} ],
    }
});

// client.on Event
// Loads WOK command handler.
client.on("ready", async () => {
    new WOK({
      client,
      commandsDir: path.join(__dirname, 'commands'),
      events: { dir: path.join(__dirname, "events"), },
      featuresDir: path.join(__dirname, 'features'),
      testServers: ['919740112391258112'],
      botOwners: ["202967961298927616"],
      cooldownConfig: {
        errorMessage: "[Cooldown] Sorry you need to wait {TIME} before using this command again.",
        botOwnersBypass: true,
      },
      disabledDefaultCommands: [
      "channelcommand",
      "customcommand",
      "requiredpermissions",
      "requiredroles",
      "togglecommand",
      "prefix"
      ],
    });
    console.log(chalk.red(`Bot Ready and Signed in as ${client.user.tag}`));
    await sequelize.sync(); // Syncs the database
});

client.login(process.env.TOKEN)

module.exports = {
  sequelize,
  Stock,
  Subscriptions,
  Settings
};