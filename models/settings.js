// Description: This file contains the sequelize model for the stock table, which is used to store the stock information for the bot
module.exports = (Sequelize, DataTypes) => {
    const Settings = Sequelize.define("Settings", {
        guild: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        botname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        stockmontiorchannel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        updateinterval: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
    return Settings;
};