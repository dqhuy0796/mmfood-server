import cartService from "../services/cartService";
import { ResponseCode } from "../constant";

let getCart = async (req, res) => {
    let customerId = req.query["customer-id"] || req.query["customerId"];

    if (!customerId) {
        return res.status(500).json({
            code: ResponseCode.MISSING_PARAMETER,
            message: "Missing infomation.",
        });
    }

    let data = await cartService.handleGetCart(customerId);

    return res.status(200).json(data);
};

let updateCart = async (req, res) => {
    let item = {};
    item.customerId = req.body.customerId;
    item.productId = req.body.productId;
    item.quantity = req.body.quantity;

    if (!item.customerId || !item.productId || !item.quantity) {
        return res.status(500).json({
            code: ResponseCode.MISSING_PARAMETER,
            message: "Missing infomation.",
        });
    }

    let data = await cartService.handleUpdateDeliveryAddress(item);

    return res.status(200).json(data);
};

export default {
    getCart,
    updateCart,
};
