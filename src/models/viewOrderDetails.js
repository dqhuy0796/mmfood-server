"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Product.init(
        {
            name: DataTypes.STRING,
            categoryId: DataTypes.INTEGER,
            imageUrl: DataTypes.TEXT,
            unit: DataTypes.STRING,
            size: DataTypes.STRING,
            oldPrice: DataTypes.DOUBLE,
            newPrice: DataTypes.DOUBLE,
            quantity: DataTypes.INTEGER,
            orderUuid: DataTypes.STRING,
            orderDetailsPrice: DataTypes.DOUBLE,
        },
        {
            sequelize,
            modelName: "ViewOrderDetails",
            tableName: "view_order_details",
            timestamps: false,
        },
    );
    return Product;
};
