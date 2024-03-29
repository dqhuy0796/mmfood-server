"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Order.hasMany(models.OrderDetails, {
                foreignKey: "orderUuid",
            });

            Order.hasMany(models.OrderState, {
                foreignKey: "orderUuid",
            });
        }
    }
    Order.init(
        {
            orderUuid: DataTypes.STRING,
            customerId: DataTypes.INTEGER,
            deliveryAddressId: DataTypes.INTEGER,
            subtotal: DataTypes.DOUBLE,
            note: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "Order",
            tableName: "orders",
        },
    );
    return Order;
};
