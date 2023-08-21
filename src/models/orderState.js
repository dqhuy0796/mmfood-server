"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class OrderState extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            OrderState.belongsTo(models.Order, {
                foreignKey: "orderUuid",
            });
        }
    }
    OrderState.init(
        {
            orderUuid: DataTypes.STRING,
            stateCode: DataTypes.INTEGER,
            stateDesc: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "OrderState",
            tableName: "order_states",
        },
    );
    return OrderState;
};
