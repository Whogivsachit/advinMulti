// Description: This file contains the sequelize model for the subscribe table, which is used to store the subscription information for the bot
module.exports = (Sequelize, DataTypes) => {
    const Subscriptions = Sequelize.define("Subscriptions", {
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        orderLink: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return Subscriptions;
};