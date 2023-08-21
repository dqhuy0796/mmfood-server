import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
    process.env.NODE_DATABASE_NAME,
    process.env.NODE_DATABASE_USERNAME,
    process.env.NODE_DATABASE_PASSWORD,
    {
        host: process.env.NODE_DATABASE_HOST,
        port: process.env.NODE_DATABASE_PORT,
        dialect: process.env.NODE_DATABASE_DIALECT,
    },
);

export default sequelize;
