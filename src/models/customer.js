"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Customer extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Customer.init(
        {
            password: DataTypes.TEXT,
            name: DataTypes.STRING,
            birth: DataTypes.DATEONLY,
            avatarUrl: DataTypes.TEXT,
            phoneNumber: DataTypes.STRING,
            email: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Customer",
            tableName: "customers",
        },
    );
    return Customer;
};
