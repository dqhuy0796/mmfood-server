import { ResponseCode } from "../constant/index.js";
import orderService from "../services/orderService.js";

let getOrder = async (req, res) => {
    const customerId = req.query.customerId;
    const orderUuid = req.query.orderUuid;

    if (customerId && !orderUuid) {
        let data = await orderService.handleGetOrders(customerId);
        return res.status(200).json(data);
    }

    if (orderUuid && !customerId) {
        let data = await orderService.handleGetOrderById(orderUuid);
        return res.status(200).json(data);
    }

    return res.status(500).json({
        code: ResponseCode.MISSING_PARAMETER,
        message: "Missing parameter(s)",
    });
};

let createOrder = async (req, res) => {
    const customerId = req.body.customerId;
    const deliveryAddressId = req.body.deliveryAddressId;
    const items = req.body.items;
    const paymentDetails = req.body.paymentDetails;

    if (customerId && deliveryAddressId && items && paymentDetails) {
        let data = await orderService.handleCreateOrder({ customerId, deliveryAddressId, items, paymentDetails });
        return res.status(200).json(data);
    }

    return res.status(500).json({
        code: ResponseCode.MISSING_PARAMETER,
        message: "Missing parameter(s)",
    });
};

let confirmOrder = async (req, res) => {
    if (req.body.uuid) {
        let data = await orderService.handleConfirmOrder(req.body.uuid);

        return res.status(200).json({
            code: data.code,
            message: data.message,
        });
    }
    return res.status(200).json({
        code: 1,
        message: "missing parameter(s)",
    });
};

let deliveryOrder = async (req, res) => {
    if (req.body.uuid) {
        let data = await orderService.handleDeliveryOrder(req.body.uuid);

        return res.status(200).json({
            code: data.code,
            message: data.message,
        });
    }
    return res.status(200).json({
        code: 1,
        message: "missing parameter(s)",
    });
};

let finishedOrder = async (req, res) => {
    if (req.body.uuid) {
        let data = await orderService.handleFinishedOrder(req.body.uuid);

        return res.status(200).json({
            code: data.code,
            message: data.message,
        });
    }
    return res.status(200).json({
        code: 1,
        message: "missing parameter(s)",
    });
};

let cancelOrder = async (req, res) => {
    if (req.body.uuid) {
        let data = await orderService.handleCancelOrder(req.body.uuid);

        return res.status(200).json({
            code: data.code,
            message: data.message,
        });
    }
    return res.status(200).json({
        code: 1,
        message: "missing parameter(s)",
    });
};

let deleteOrder = async (req, res) => {
    if (req.body.id) {
        let data = await orderService.handleDeleteOrder(req.body.id);
        console.log(data);
        return res.status(200).json({
            code: data.code,
            message: data.message,
        });
    }
    return res.status(200).json({
        code: 1,
        message: "missing parameter(s)",
    });
};

export default {
    getOrder,
    createOrder,
    confirmOrder,
    deliveryOrder,
    finishedOrder,
    cancelOrder,
    deleteOrder,
};
