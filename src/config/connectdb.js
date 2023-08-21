import sequelize from "./database";

const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connected successfully on port", process.env.NODE_DATABASE_PORT);
    } catch (error) {
        console.error("Connection failure:", error);
    }
};

export default connectDatabase;
