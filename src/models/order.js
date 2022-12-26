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
            orderUuid: DataTypes.STRING,
            customerId: DataTypes.INTEGER,
            receiverDetails: DataTypes.TEXT,
            items: DataTypes.TEXT,
            paymentDetails: DataTypes.TEXT,
            state: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "Order",
        },
    );
    return Order;
};

// const Order = {
//     orderId: "string",
//     customerId: "string",
//     receiverDetails: {
//         name: "string",
//         phone: "string",
//         address: "string",
//         note: "string",
//     },
//     items: [
//         {
//             id: "string",
//             name: "string",
//             oldPrice: "double",
//             newPrice: "double",
//             ...props,
//         },
//     ],
//     paymentDetails: {
//         subtotal: "double",
//         discount: "double",
//         deliveryCharges: "double",
//         totalPayment: "double",
//     },
//     state: [
//         {
//             name: "being processed/has been confirmed/on shipped/finished/canceled",
//             time: "time",
//         },
//     ],
// };
