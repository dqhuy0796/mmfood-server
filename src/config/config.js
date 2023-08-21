const dotenv = require("dotenv");

dotenv.config();

module.exports = {
    development: {
        username: process.env.NODE_DATABASE_USERNAME,
        password: process.env.NODE_DATABASE_PASSWORD,
        database: process.env.NODE_DATABASE_NAME,
        host: process.env.NODE_DATABASE_HOST,
        port: process.env.NODE_DATABASE_PORT,
        dialect: process.env.NODE_DATABASE_DIALECT,
        query: {
            raw: true,
        },
        timezone: "+07:00",
    },
    test: {
        database: "database_test",
        username: process.env.NODE_DATABASE_USERNAME,
        password: process.env.NODE_DATABASE_PASSWORD,
        host: process.env.NODE_DATABASE_HOST,
        port: process.env.NODE_DATABASE_PORT,
        dialect: process.env.NODE_DATABASE_DIALECT,
    },
    production: {
        database: "database_production",
        username: process.env.NODE_DATABASE_USERNAME,
        password: process.env.NODE_DATABASE_PASSWORD,
        host: process.env.NODE_DATABASE_HOST,
        port: process.env.NODE_DATABASE_PORT,
        dialect: process.env.NODE_DATABASE_DIALECT,
    },
};
