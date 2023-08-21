"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class DeliveryAddress extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    DeliveryAddress.init(
        {
            customerId: DataTypes.INTEGER,
            details: DataTypes.TEXT,
            ward: DataTypes.STRING,
            district: DataTypes.STRING,
            province: DataTypes.STRING,
            receiverName: DataTypes.STRING,
            receiverPhoneNumber: DataTypes.STRING,
            isDefault: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: "DeliveryAddress",
            tableName: "delivery_addresses",
        },
    );
    return DeliveryAddress;
};
