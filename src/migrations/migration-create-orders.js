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
            deliveryAddressId: {
                type: Sequelize.INTEGER,
            },
            note: {
                type: Sequelize.TEXT,
            },
            subtotal: {
                type: Sequelize.DOUBLE,
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
