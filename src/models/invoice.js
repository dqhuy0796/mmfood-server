"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Invoice extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Invoice.init(
        {
            orderId: DataTypes.INTEGER,
            timeStamp: DataTypes.DATE,
            discount: DataTypes.DOUBLE,
            tax: DataTypes.DOUBLE,
            totalPayment: DataTypes.DOUBLE,
            description: DataTypes.TEXT,
            state: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Invoice",
            tableName: "invoices",
        },
    );
    return Invoice;
};
