'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('allcodes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            key: {
                type: Sequelize.STRING,
            },
            type: {
                type: Sequelize.STRING,
            },
            valueEng: {
                type: Sequelize.TEXT,
            },
            valueVie: {
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
        await queryInterface.dropTable('allcodes');
    },
};
