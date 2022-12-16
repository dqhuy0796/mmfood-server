"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("products", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
            },
            categoryId: {
                type: Sequelize.INTEGER,
            },
            imageUrl: {
                type: Sequelize.TEXT,
            },
            unit: {
                type: Sequelize.STRING,
            },
            size: {
                type: Sequelize.STRING,
            },
            oldPrice: {
                type: Sequelize.DOUBLE,
            },
            newPrice: {
                type: Sequelize.DOUBLE,
            },
            description: {
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
        await queryInterface.dropTable("products");
    },
};
