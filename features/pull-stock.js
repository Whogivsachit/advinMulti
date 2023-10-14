// Description: Pulls stock data from the API and stores it in the database. & Notifies users when a product is in stock.
const axios = require("axios");
require("dotenv/config");
const { Stock, Subscriptions } = require("../index.js");
module.exports = async (client) => {

    // Description: Notifies users when a product is in stock.
    async function notifyUsers(orderLink) {
        const userSubscriptions = await Subscriptions.findAll({ where: { orderLink: orderLink } });
        for(const subscription of userSubscriptions) {
            const user = await client.users.fetch(subscription.userId);
            await user.send(`The product you are subscribed to (${subscription.category}-${subscription.name}) is now in stock! You can order it here: https://clients.advinservers.com${orderLink}`);
            console.log(`Notified ${subscription.userId} that ${subscription.category}-${subscription.name} is in stock.`)
        }
    }

    // Description: Pulls stock data from the API and stores it in the database.
    async function pullstock() {
        try {
            const response = await axios.get(process.env.APIURL, {
                headers: {
                    "Authorization": `Bearer ${process.env.APITOKEN}`,
                    "Content-Type": "application/json"
                }
            });

            const products = response.data.body;
            if(response.data.status !== 200) return console.log("An error occurred while pulling stock data from API:", response.status);

            for(const product of products) {
                const productInDatabase = await Stock.findOne({ where: { orderLink: product.orderLink } });
    
                // If the product is not in the database, add it.
                if(!productInDatabase) { 
                    await Stock.create({
                        category: product.category,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        inStock: product.inStock,
                        orderLink: product.orderLink,
                    });
                    console.log(`Added ${product.name} (${product.orderLink}) to the database.`);
                } else  {
                    // If the product is in the database, update the stock if it has changed.
                    if(productInDatabase.inStock !== product.inStock) {
                        await Stock.update({ inStock: product.inStock }, { where: { orderLink: product.orderLink } });
                        console.log(`Updated stock for ${product.name} (${product.orderLink})`);
                        if(product.inStock === true) {
                            notifyUsers(product.orderLink);
                        } 
                    }
                }
            }
        } catch(error) {
            console.log("An error occurred on pull-stock:", error);
        }
    }

    await pullstock(); // Pull stock data on startup.
    setInterval(pullstock, process.env.UPDATEINTERVAL)


};