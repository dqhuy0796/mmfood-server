import orderService from "../services/orderService";

let getOrder = async (req, res) => {
    if (req.query.id) {
        let data = await orderService.handleGetOrder(req.query.id);
        return res.status(200).json({
            code: data.code,
            message: data.message,
            result: data.result ? data.result : {},
        });
    }
    return res.status(200).json({
        code: 1,
        message: "missing parameter(s)",
    });
};

let createOrder = async (req, res) => {
    let order = {};
    order.customerId = req.body.customerId;
    order.receiverDetails = req.body.receiverDetails;
    order.items = req.body.items;
    order.paymentDetails = req.body.paymentDetails;

    let data = await orderService.handleCreateOrder(order);

    return res.status(200).json({
        code: data.code,
        message: data.message,
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

module.exports = {
    getOrder,
    createOrder,
    confirmOrder,
    deliveryOrder,
    finishedOrder,
    cancelOrder,
    deleteOrder,
};
