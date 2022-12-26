"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("orders", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            orderUuid: {
                type: Sequelize.STRING,
            },
            customerId: {
                type: Sequelize.INTEGER,
            },
            receiverDetails: {
                type: Sequelize.TEXT,
            },
            items: {
                type: Sequelize.TEXT,
            },
            paymentDetails: {
                type: Sequelize.TEXT,
            },
            state: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable("orders");
    },
};
