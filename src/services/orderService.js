import db from "../models";

let handleGetOrder = (paramId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            if (paramId && paramId === "all") {
                let orders = await db.Order.findAll({
                    order: [["id", "DESC"]],
                });
                data.code = 0;
                data.message = "get order(s) success";
                data.result = orders;
            }
            if (paramId && paramId !== "all") {
                let order = await db.Order.findAll({
                    where: { customerId: paramId },
                    order: [["id", "DESC"]],
                });
                if (order) {
                    data.code = 0;
                    data.message = "get order success";
                    data.result = order;
                } else {
                    data.code = 2;
                    data.message = "get order failed";
                }
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleCreateOrder = (order) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        let datetimeUuid = new Date().valueOf();
        await db.Order.create({
            orderUuid: datetimeUuid,
            customerId: order.customerId,
            receiverDetails: order.receiverDetails,
            items: order.items,
            paymentDetails: order.paymentDetails,
            state: "Chờ xử lý",
        });
        // có nên map từ stringlify order detail ra bảng mới
        data.code = 0;
        data.message = "create order success";
        try {
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleUpdateOrder = (order) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetOrder = await db.Order.findOne({
                where: { id: order.id },
            });
            if (targetOrder) {
                await db.Order.update(
                    {
                        customerId: order.customerId,
                        employeeId: order.employeeId,
                        orderDetail: order.orderDetail,
                        time: order.time,
                        description: order.description,
                        state: order.state,
                    },
                    {
                        where: { id: order.id },
                    },
                );
                data.code = 0;
                data.message = "update order success";
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

let handleCancelOrder = (uuid) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetOrder = await db.Order.findOne({
                where: { orderUuid: uuid },
            });
            if (targetOrder) {
                await db.Order.update(
                    {
                        state: "Đã hủy",
                    },
                    {
                        where: { orderUuid: uuid },
                    },
                );
                data.code = 0;
                data.message = "this order has been cancelled";
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

export default {
    handleGetOrder,
    handleCreateOrder,
    handleUpdateOrder,
    handleCancelOrder,
    handleDeleteOrder,
};
