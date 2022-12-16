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
            // define association here
        }
    }
    Order.init(
        {
            customerId: DataTypes.INTEGER,
            employeeId: DataTypes.INTEGER,
            orderDetail: DataTypes.TEXT,
            time: DataTypes.DATE,
            description: DataTypes.TEXT,
            state: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Order",
        },
    );
    return Order;
};
