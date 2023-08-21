"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class OrderDetails extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            OrderDetails.belongsTo(models.Order, {
                foreignKey: "orderUuid",
            });
        }
    }
    OrderDetails.init(
        {
            orderUuid: DataTypes.STRING,
            productId: DataTypes.INTEGER,
            price: DataTypes.DOUBLE,
            quantity: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "OrderDetails",
            tableName: "order_details",
        },
    );
    return OrderDetails;
};
