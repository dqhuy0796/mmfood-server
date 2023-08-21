import deliveryAddressService from "../services/deliveryAddressService";
import { ResponseCode } from "../constant";

let getDeliveryAddress = async (req, res) => {
    let customerId = req.query.customerId;

    if (!customerId) {
        return res.status(500).json({
            code: ResponseCode.MISSING_PARAMETER,
            message: "Missing infomation.",
        });
    }

    let data = await deliveryAddressService.handleGetDeliveryAddress(customerId);

    return res.status(200).json(data);
};

let createDeliveryAddress = async (req, res) => {
    let address = {};
    address.customerId = req.body.customerId;
    address.details = req.body.details;
    address.ward = req.body.ward;
    address.district = req.body.district;
    address.province = req.body.province;
    address.receiverName = req.body.receiverName;
    address.receiverPhoneNumber = req.body.receiverPhoneNumber;
    address.isDefault = req.body.isDefault || false;

    let data = await deliveryAddressService.handleCreateDeliveryAddress(address);

    return res.status(200).json(data);
};

let updateDeliveryAddress = async (req, res) => {
    let address = {};
    address.id = req.body.id;
    address.customerId = req.body.customerId;
    address.details = req.body.details;
    address.ward = req.body.ward;
    address.district = req.body.district;
    address.province = req.body.province;
    address.receiverName = req.body.receiverName;
    address.receiverPhoneNumber = req.body.receiverPhoneNumber;
    address.isDefault = req.body.isDefault || false;

    if (
        !address.id ||
        !address.customerId ||
        !address.details ||
        !address.ward ||
        !address.district ||
        !address.province ||
        !address.receiverName ||
        !address.receiverPhoneNumber
    ) {
        return res.status(200).json({
            code: ResponseCode.MISSING_PARAMETER,
            message: "Missing infomation.",
        });
    }

    let data = await deliveryAddressService.handleUpdateDeliveryAddress(address);

    return res.status(200).json(data);
};

let deleteDeliveryAddress = async (req, res) => {
    let addressId = req.body["id"];
    let customerId = req.body["customerId"];

    if (!customerId || !addressId) {
        return res.status(500).json({
            code: ResponseCode.MISSING_PARAMETER,
            message: "Missing infomation.",
        });
    }

    let data = await deliveryAddressService.handleDeleteDeliveryAddress(addressId, customerId);

    return res.status(200).json(data);
};

export default {
    getDeliveryAddress,
    createDeliveryAddress,
    updateDeliveryAddress,
    deleteDeliveryAddress,
};
