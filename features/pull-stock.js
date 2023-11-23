// Description: Pulls stock data from the API and stores it in the database.
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
require("dotenv/config");
const { Stock, Subscriptions, Settings } = require("../index.js");
module.exports = async (instance, client) => {

    // Description: Notifies users when a product is in stock.
    async function notifyUsers(orderLink) {
        const userSubscriptions = await Subscriptions.findAll({ where: { orderLink: orderLink } });
        for(const subscription of userSubscriptions) {
            client.users.fetch(subscription.userId).then((user) => {
                user.send(`The product you are subscribed to (${subscription.category}-${subscription.name}) is now in stock! You can order it here: https://clients.advinservers.com${orderLink}`);
            });
            console.log(`Notified ${subscription.userId} that ${subscription.category}-${subscription.name} is in stock.`)
        }
    }

    // Channel Embed on update.
    async function updateChannel(product, inStock, type) {
        const settings = await Settings.findOne({ where: { guild: "823715598336786443"} }); // Hard coded to just advin servers guild. If you want multi guild support, you'll need to change this. 
        const guildN = await client.guilds.fetch(settings.guild);
        const channelToSend = await guildN.channels.fetch(settings.stockmontiorchannel);
        const createdAt = Math.floor(new Date(product.createdAt).getTime() / 1000);
        const updatedAt = Math.floor(new Date(product.updatedAt).getTime() / 1000);
 
        switch (type) {
            case "update":
                var embed = new EmbedBuilder()
                .setTitle(`**${product.category.split('-')[0]} -> ${product.name}** is now **${inStock ? "In Stock" : "Out Of Stock"}**`)
                .setTimestamp(new Date())
                .setDescription(`\`\`\`Price: $${product.price}\n${product.description}\`\`\`\nCreated At: <t:${createdAt}>\nLast Updated: <t:${updatedAt}> `)
                .setURL(`https://clients.advinservers.com${product.orderLink}`)
                inStock ? embed.setColor(5763719) : embed.setColor(15548997);
                //channelToSend.send({ content: '<@&1164761419011604491>',  embeds: [embed] });
                inStock ? channelToSend.send({ content: '<@&1164761419011604491>',  embeds: [embed] }) : channelToSend.send({ embeds: [embed] });
            break;
            case "new":
                var embed = new EmbedBuilder()
                .setTitle(`**${product.category.split('-')[0]} -> ${product.name}** has been added to the stock monitor!`)
                .setTimestamp(new Date())
                .setDescription(`\`\`\`Price: $${product.price}\n${product.description}\`\`\`\n`)
                .setURL(`https://clients.advinservers.com${product.orderLink}`)
                .setColor(5763719)
                channelToSend.send({ content: '<@&1164761419011604491>',  embeds: [embed] });
            break;
            case "change":
                const productInDatabase = await Stock.findOne({ where: { orderLink: product.orderLink } });
				const nprice = Math.round(product.price);
                
                var embed = new EmbedBuilder()
                .setTitle(`**${product.category.split('-')[0]} -> ${product.name}** has been updated!`)
                .setTimestamp(new Date())
                .setDescription(`**__OLD:__** \`\`\`Price: $${productInDatabase.price}\n${productInDatabase.description}\`\`\`\n **__NEW:__** \`\`\`Price: $${nprice}\n${product.description}\`\`\`\n        `)
                .setURL(`https://clients.advinservers.com${product.orderLink}`)
                .setColor(5793266)
                channelToSend.send({ embeds: [embed] });
        }

    }

    // Description: Pulls stock data from the API and stores it in the database.
    async function pullstock() {
        const response = await axios.get(process.env.APIURL, {
            headers: {
                "Authorization": `Bearer ${process.env.APITOKEN}`,
                "Content-Type": "application/json"
            }
        }).catch(error => {
    		console.log("An error occurred on pull-stock pullstockFunc:", error);
		});

        if(response.data.status !== 200) return console.log("An error occurred while pulling stock data from API:", response.status, response.data);
        const products = response.data.body;
 
        for(const product of products) {
            const productInDatabase = await Stock.findOne({ where: { orderLink: product.orderLink } }); // Check if the product is already in the database.

            // If the product is not in the database, add it.
            if(!productInDatabase) { 
                await Stock.create({
                    category: product.category,
                    name: product.name,
                    description: product.description,
                    price: Math.round(product.price),
                    inStock: product.inStock,
                    orderLink: product.orderLink,
                });
                console.log(`Added ${product.name} (${product.orderLink}) to the database.`);
                updateChannel(product, product.inStock, "new"); // Notify users that a new product has been added.
            } else  {
                // If the product is in the database, update the stock if it has changed.
                if(productInDatabase.inStock !== product.inStock) {
                    await Stock.update({ inStock: product.inStock }, { where: { orderLink: product.orderLink } });
                    console.log(`Updated stock for ${product.name} (${product.orderLink})`);
                    updateChannel(productInDatabase, product.inStock, "update") // Update the stock in the channel embed.

                    if(product.inStock === true) { // If the product is in stock, notify users.
                       notifyUsers(product.orderLink);
                    } 
                }

                if(Math.round(productInDatabase.price) !== Math.round(product.price) || productInDatabase.description !== product.description) {
                    Stock.update({
                        category: product.category,
                        name: product.name,
                        description: product.description,
                        price: Math.round(product.price),
                        inStock: product.inStock,
                        orderLink: product.orderLink,
                    }, { where: { orderLink: product.orderLink } });
                    updateChannel(product, product.inStock, "change");
                    console.log(`Updated ${product.name} (${product.orderLink})`);
                }
            }
        }
    }


    pullstock(); // Pull stock data on startup.
    setInterval(async () => {
        await pullstock();
    }, process.env.UPDATEINTERVAL); // Pull stock data every 2 minutes.
    
};