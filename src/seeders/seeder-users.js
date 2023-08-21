"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("Users", [
            {
                password: "$2a$10$XT.VGE7USxy3uu/dI9SDsu7RMqf2rjzCPOcedYlz9EsIKHdmbrkKa",
                name: "admin",
                birth: "1996/07/31",
                avatarUrl: null,
                phoneNumber: "0989999999",
                email: "admin@mmfood.vn",
                address: "z115, Tân Thịnh, Tp. Thái Nguyên, Thái Nguyên",
                role: "admin",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                password: "$2a$10$XT.VGE7USxy3uu/dI9SDsu7RMqf2rjzCPOcedYlz9EsIKHdmbrkKa",
                name: "dqhuy",
                birth: "1996/07/31",
                avatarUrl: null,
                phoneNumber: "0985805096",
                email: "dqhuy0796@gmail.com",
                address: "z115, Tân Thịnh, Tp. Thái Nguyên, Thái Nguyên",
                role: "admin",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Users", null, {});
    },
};
