// Description: Pulls stock data from the API and stores it in the database.
const axios = require("axios");
require("dotenv/config");
const { Stock, Subscriptions } = require("../index.js");
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

    // Description: Pulls stock data from the API and stores it in the database.
    async function pullstock() {
        const response = await axios.get(process.env.APIURL, {
            headers: {
                "Authorization": `Bearer ${process.env.APITOKEN}`,
                "Content-Type": "application/json"
            }
        });
        const products = response.data.body;

        if(response.data.status !== 200) return console.log("An error occurred while pulling stock data from API:", response.status, response.data);
            
        for(const product of products) {
            const productInDatabase = await Stock.findOne({ where: { orderLink: product.orderLink } }); // Check if the product is already in the database.

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
                    notifyUsers(product.orderLink);
                }
            }
        }
        console.log("Finished pulling stock data from API.")
    }


    await pullstock(); // Pull stock data on startup.
    setInterval(async () => {
        await pullstock();
    }, process.env.UPDATEINTERVAL); // Pull stock data every 2 minutes.
    
};