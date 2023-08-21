import db from "../models";
import { OrderStateCode, ResponseCode } from "../constant";
import sequelize from "../config/database";

const handleGetOrders = async (customerId) => {
    try {
        if (!customerId) {
            return {
                code: ResponseCode.MISSING_PARAMETER,
                message: "Missing parameter(s).",
            };
        }

        let orderFilter = {};

        if (customerId !== "all") {
            orderFilter = { customerId };
        }

        const orders = await db.Order.findAll({
            where: orderFilter,
            order: [["id", "DESC"]],
        });

        const orderUuids = orders.map((order) => order.orderUuid);
        const orderAddressIds = orders.map((order) => order.deliveryAddressId);

        const [orderStates, orderDetails, orderDeliveryAddresses] = await Promise.all([
            db.OrderState.findAll({ where: { orderUuid: orderUuids } }),
            db.ViewOrderDetails.findAll({ where: { orderUuid: orderUuids } }),
            db.DeliveryAddress.findAll({ where: { id: orderAddressIds } }),
        ]);

        const result = orders.map((item) => {
            const items = orderDetails.filter((details) => details.orderUuid === item.orderUuid);
            const states = orderStates.filter((states) => states.orderUuid === item.orderUuid);
            const deliveryAddress = orderDeliveryAddresses.find((address) => address.id === item.deliveryAddressId);

            return {
                ...item,
                items,
                states,
                deliveryAddress,
            };
        });

        return {
            code: ResponseCode.SUCCESS,
            message: "Retrieved orders successfully",
            result: result,
        };
    } catch (error) {
        console.log(error);

        return {
            code: ResponseCode.DATABASE_ERROR,
            message: "An error occurred while retrieving the order.",
        };
    }
};

// const handleGetOrders = async (customerId) => {
//     try {
//         if (!customerId) {
//             return {
//                 code: ResponseCode.MISSING_PARAMETER,
//                 message: "Missing parameter(s).",
//             };
//         }

//         if (customerId === "all") {
//                         const allOrders = await db.Order.findAll({
//                 include: [
//                     {
//                         model: db.OrderState,
//                     },
//                     {
//                         model: db.OrderDetails,
//                     },
//                 ],
//             });

//             return {
//                 code: ResponseCode.SUCCESS,
//                 message: "Retrieved orders successfully",
//                 result: allOrders,
//             };
//         }

//         const orders = await db.Order.findAll({
//             where: { customerId: Number(customerId) },
//             attributes: ["orderUuid", "customerId", "deliveryAddressId", "subtotal", "note"],
//             include: [
//                 {
//                     model: db.OrderState,
//                     attributes: ["stateCode", "stateDesc"],
//                 },
//                 {
//                     model: db.OrderDetails,
//                     attributes: ["productId", "quantity", "price"],
//                 },
//             ],
//         });

//         return {
//             code: ResponseCode.SUCCESS,
//             message: "Retrieved orders successfully",
//             result: orders,
//         };
//     } catch (error) {
//         console.log(error);

//         return {
//             code: ResponseCode.DATABASE_ERROR,
//             message: "An error occurred while retrieving the order.",
//         };
//     }
// };

const handleGetOrderById = async (orderUuid) => {
    try {
        if (!orderUuid) {
            return {
                code: ResponseCode.MISSING_PARAMETER,
                message: "Missing parameter(s).",
            };
        }

        const order = await db.Order.findOne({
            where: { orderUuid },
        });

        if (!order) {
            return {
                code: ResponseCode.FILE_NOT_FOUND,
                message: `Order ${orderUuid} not found.`,
            };
        }

        const [orderStates, orderDetails, deliveryAddress] = await Promise.all([
            db.OrderState.findAll({ where: { orderUuid } }),
            db.ViewOrderDetails.findAll({ where: { orderUuid } }),
            db.DeliveryAddress.findOne({ where: { id: order.deliveryAddressId } }),
        ]);

        return {
            code: ResponseCode.SUCCESS,
            message: `Retrieved order ${orderUuid} successfully`,
            result: {
                ...order,
                items: orderDetails,
                states: orderStates,
                deliveryAddress: deliveryAddress,
            },
        };
    } catch (error) {
        console.log(error);

        return {
            code: ResponseCode.DATABASE_ERROR,
            message: "An error occurred while retrieving the order.",
        };
    }
};

const handleCreateOrder = async (order) => {
    const t = await sequelize.transaction();

    try {
        const thisMoment = new Date();
        const datetimeUuid = thisMoment.valueOf();

        const orderDataToInsert = {
            orderUuid: datetimeUuid,
            customerId: order.customerId,
            deliveryAddressId: order.deliveryAddressId,
            subtotal: order.paymentDetails.subtotal,
            note: order.paymentDetails?.note || "",
        };

        const orderItemsToInsert = order.items.map((item) => ({
            orderUuid: datetimeUuid,
            productId: item.id,
            quantity: item.quantity,
            price: item.newPrice,
        }));

        const orderStateToInsert = {
            orderUuid: datetimeUuid,
            stateCode: OrderStateCode.PROCESSED,
            stateDesc: "Chờ xử lý",
        };

        await db.Order.create(orderDataToInsert, { transaction: t });
        await db.OrderState.create(orderStateToInsert, { transaction: t });
        await db.OrderDetails.bulkCreate(orderItemsToInsert, { transaction: t });

        await t.commit();

        return {
            code: ResponseCode.SUCCESS,
            message: "Create order successfully",
            orderUuid: datetimeUuid,
        };
    } catch (error) {
        await t.rollback();

        console.log(error);

        return {
            code: ResponseCode.DATABASE_ERROR,
            message: "An error occurred during the transaction.",
        };
    }
};

let handleConfirmOrder = (uuid) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetOrder = await db.Order.findOne({
                where: { orderUuid: uuid },
            });
            if (targetOrder) {
                const thisMoment = new Date();
                const stateArray = JSON.parse(targetOrder.state);
                if (stateArray[stateArray.length - 1].code < 1) {
                    const newStateArray = [
                        ...stateArray,
                        {
                            code: 1,
                            description: "Đã xác nhận",
                            time: thisMoment.toISOString(),
                        },
                    ];
                    await db.Order.update(
                        {
                            state: JSON.stringify(newStateArray),
                        },
                        {
                            where: { orderUuid: uuid },
                        },
                    );
                    data.code = 0;
                    data.message = "this order has been confirmed";
                }
            } else {
                data.code = 2;
                data.message = "invalid order";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleDeliveryOrder = (uuid) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetOrder = await db.Order.findOne({
                where: { orderUuid: uuid },
            });
            if (targetOrder) {
                const thisMoment = new Date();
                const stateArray = JSON.parse(targetOrder.state);
                if (stateArray[stateArray.length - 1].code < 2) {
                    const newStateArray = [
                        ...stateArray,
                        {
                            code: 2,
                            description: "Đang giao hàng",
                            time: thisMoment.toISOString(),
                        },
                    ];
                    await db.Order.update(
                        {
                            state: JSON.stringify(newStateArray),
                        },
                        {
                            where: { orderUuid: uuid },
                        },
                    );
                    data.code = 0;
                    data.message = "this order being delivery";
                }
            } else {
                data.code = 2;
                data.message = "invalid order";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleFinishedOrder = (uuid) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetOrder = await db.Order.findOne({
                where: { orderUuid: uuid },
            });
            if (targetOrder) {
                const thisMoment = new Date();
                const stateArray = JSON.parse(targetOrder.state);
                if (stateArray[stateArray.length - 1].code === 2) {
                    const newStateArray = [
                        ...stateArray,
                        {
                            code: 3,
                            description: "Giao hàng thành công",
                            time: thisMoment.toISOString(),
                        },
                    ];
                    await db.Order.update(
                        {
                            state: JSON.stringify(newStateArray),
                        },
                        {
                            where: { orderUuid: uuid },
                        },
                    );
                    data.code = 0;
                    data.message = "delivery success";
                }
            } else {
                data.code = 2;
                data.message = "invalid order";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleCancelOrder = (uuid) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetOrder = await db.Order.findOne({
                where: { orderUuid: uuid },
            });
            if (targetOrder) {
                const thisMoment = new Date();
                const stateArray = JSON.parse(targetOrder.state);
                if (stateArray[stateArray.length - 1].code !== 4) {
                    const newStateArray = [
                        ...stateArray,
                        {
                            code: 4,
                            description: "Đã hủy",
                            time: thisMoment.toISOString(),
                        },
                    ];
                    await db.Order.update(
                        {
                            state: JSON.stringify(newStateArray),
                        },
                        {
                            where: { orderUuid: uuid },
                        },
                    );
                    data.code = 0;
                    data.message = "this order has been cancelled";
                }
            } else {
                data.code = 2;
                data.message = "invalid order";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleDeleteOrder = (orderId) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetOrder = await db.Order.findOne({
                where: { id: orderId },
            });
            if (targetOrder) {
                await db.Order.destroy({
                    where: { id: orderId },
                });
                data.code = 0;
                data.message = "delete order success";
            } else {
                data.code = 1;
                data.message = "invalid order";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleGetOrders,
    handleGetOrderById,
    handleCreateOrder,
    handleConfirmOrder,
    handleDeliveryOrder,
    handleFinishedOrder,
    handleCancelOrder,
    handleDeleteOrder,
};
