'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [
            {
                password: '12345678',
                name: 'admin',
                birth: '1996/07/31',
                avatarUrl: null,
                phone: '0989999999',
                email: 'admin@mmfood.vn',
                address: 'z115, Tân Thịnh, Tp. Thái Nguyên, Thái Nguyên',
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    },
};
