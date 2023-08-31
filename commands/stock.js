// Description: View the stock of the provided category/filter
const { EmbedBuilder } = require("discord.js");
const { CommandType } = require("wokcommands");
const { Stock } = require("../index.js");
require("dotenv/config");

// Generate the valid categories for the autocomplete
const generateValidCategories  = async () => {
    const categories = await Stock.findAll({ attributes: ['category'], group: ['category'], }); // Get all the categories from the database
    const additional = [{ name: "In Stock", value: "instock" }, { name: "All Stock", value: "allstock" }]; // Add the allstock and instock options
    const categoryOptions = categories.map((category) => ({ name: category.category, value: category.category }));
    return [...additional, ...categoryOptions] // Combine the two arrays
}

module.exports = {
    category: "Stock",
    aliases: ["stock", "inventory", "avail", "available", "instock"],
    description: 'Check the stock of a product, category, or all products.',
    type: CommandType.SLASH,
    guildOnly: true,
    options: [
        {
            name: 'category',
            description: 'The Category you want to view.',
            type: 3,
            required: true,
            autocomplete: true,
        }
    ],

    // Fill in categories Automatically
    autocomplete: async (command, argument, interaction) => {
        return await generateValidCategories ();
    },

    callback: async ({ interaction }) => {
        const categoryArg = interaction.options.getString('category'); // Get the category argument
        const validCategories = await generateValidCategories (); // Get the valid categories

        const loadingMsg = await interaction.reply({ embeds: [{description: 'Thinking... <a:loading:1136369821815144609>'}], fetchReply: true });// Send loading embed
        if(interaction.guild.id !== "919740112391258112") return await loadingMsg.edit({ embeds: [{description: 'This command can only be ran in advinservers'}], fetchReply: true }); // Ensure the command is ran in the correct guild
        if(!validCategories.some((category) => category.value === categoryArg)) return await loadingMsg.edit({ embeds: [{description: `Sorry ${categoryArg} is not a valid category.`}], fetchReply: true }); // Ensure the category is valid

        // Create the main embed
        const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTimestamp()
        .setThumbnail(process.env.LOGOURL)
        .setTitle(process.env.PNAME)
        .setDescription(`${process.env.PNAME}\n Viewing Stock for __${categoryArg.replace(/-/g, ' ')}__`)
        .setFooter({
            text: process.env.PNAME,
            iconURL: process.env.LOGOURL
        })

        let whereClause = {};

        // Setup our where clause for the query
        if(categoryArg !== 'allstock') {
            if(categoryArg === 'instock') {
                whereClause = { inStock: true };
            } else {
                whereClause = { category: categoryArg };
            }
        }

        const products = await Stock.findAll({ where: whereClause }); // Get the products from the database
        if(!products) return await loadingMsg.edit({ embeds: [{description: `${categoryArg} has no products...`}], fetchReply: true }); // Ensure the category is valid
        const categories = Array.from(new Set(products.map((product) => product.category))); // Get the categories from the products
        
        // Loop through the categories and add them to the embed
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

        await loadingMsg.edit({ embeds: [embed] });

    },
  }