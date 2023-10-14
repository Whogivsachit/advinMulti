// Description: View documentation for Advin Servers
const { EmbedBuilder } = require("discord.js");
const { CommandType } = require("wokcommands");
const { Stock } = require("../index.js");
require("dotenv/config");

module.exports = {
    category: "Fun",
    aliases: ["documentation", "docs"],
    description: 'View Documentation',
    type: CommandType.SLASH,
    guildOnly: true,
    options: [
        {
            name: 'document',
            description: 'The document you wish to view',
            type: 3,
            required: true,
            autocomplete: true,
        }
    ],

    // Fill in categories Automatically
    autocomplete: async (command, argument, interaction) => {
       return [ 
            { name: "Terms Of Service", value: "https://advinservers.com/termsofservice" },
            { name: "Privacy Policy", value: "https://advinservers.com/privacypolicy" },
            { name: "Service Level Agreement", value: "https://clients.advinservers.com/knowledgebase/13/Service-Level-Agreement.html" },
            { name: "Refund Policy", value: "https://clients.advinservers.com/knowledgebase/2/Refund-Policy.html" },
            { name: "CPU Prioritization", value: "https://clients.advinservers.com/knowledgebase/6/CPU-Prioritization.html" },
            { name: "Flux Node Information", value: "https://clients.advinservers.com/knowledgebase/10/Flux-Node-Information.html" },
            { name: "Virtual Locations", value: "https://clients.advinservers.com/knowledgebase/12/Virtual-Location.html" },
            { name: "VNC Not Working", value: "https://clients.advinservers.com/knowledgebase/5/VNC-Not-Working.html" },
            { name: "Moving Server Or Migrations", value: "https://clients.advinservers.com/knowledgebase/11/Moving-Server.html" },
            { name: "Apply Upgrades", value: "https://clients.advinservers.com/knowledgebase/8/How-to-Apply-Changes-Like-Upgrades.html" },
            { name: "CPU Steal", value: "https://clients.advinservers.com/knowledgebase/7/High-CPU-Steal.html" },
            { name: "Convoy Guide", value: "https://clients.advinservers.com/knowledgebase/16/Convoy-Guide.html" },
            { name: "Edit MTU", value: "https://clients.advinservers.com/knowledgebase/9/Configure-the-MTU.html" },
            { name: "RDNS OR PTR", value: "https://clients.advinservers.com/knowledgebase/14/Configure-RDNSorPTR.html" },
            { name: "When Will My Server Deploy?", value: "https://clients.advinservers.com/knowledgebase/1/When-will-your-server-be-deployed.html" },
            { name: "Test IPV4", value: "https://clients.advinservers.com/knowledgebase/4/Test-IPv4-Addresses.html" },
            { name: "Eygel Bandwidth Information", value: "https://clients.advinservers.com/knowledgebase/15/Eygelshoven-Bandwidth-Information.html" },
       ];
    },

    callback: async ({ interaction }) => {
        const document = interaction.options.getString('document');
        const documentName = document.split("/").pop().split(".")[0];
        interaction.reply({ embeds: [{ description: `Heres our current documentation for [${documentName}](${document}). If you need any additonal help please feel free to create a ticket or check out <#926657405830459402>`}], fetchReply: true });
    },
  }