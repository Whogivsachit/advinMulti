// Description: This file contains the sequelize model for the stock table, which is used to store the stock information for the bot
module.exports = (Sequelize, DataTypes) => {
    const Stock = Sequelize.define("Stock", {
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        inStock: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        orderLink: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });
    return Stock;
};