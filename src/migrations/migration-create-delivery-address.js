"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("delivery_addresses", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            customerId: {
                type: Sequelize.INTEGER,
            },
            details: {
                type: Sequelize.TEXT,
            },
            ward: {
                type: Sequelize.STRING,
            },
            district: {
                type: Sequelize.STRING,
            },
            province: {
                type: Sequelize.STRING,
            },
            receiverName: {
                type: Sequelize.STRING,
            },
            receiverPhoneNumber: {
                type: Sequelize.STRING,
            },
            isDefault: {
                type: Sequelize.BOOLEAN,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("delivery_addresses");
    },
};
