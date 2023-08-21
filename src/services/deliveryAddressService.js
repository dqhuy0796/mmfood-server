import { ResponseCode } from "../constant";
import db from "../models";

/** GET DELIVERY ADDRESS */

let handleGetDeliveryAddress = (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!customerId) {
                resolve({
                    code: ResponseCode.MISSING_PARAMETER,
                    message: "Missing parameter(s).",
                });
            }

            let addresses = await db.DeliveryAddress.findAll({
                where: { customerId: customerId },
                order: [["id", "DESC"]],
            });

            //if not exist -> invalid
            if (!addresses) {
                resolve({
                    code: ResponseCode.FILE_NOT_FOUND,
                    message: "Invalid customer",
                });
            }

            // if exist -> array[]
            else {
                resolve({
                    code: ResponseCode.SUCCESS,
                    message: "Get delivery successfully",
                    result: addresses,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

/** CREATE NEW DELIVERY ADDRESS */

let handleCreateDeliveryAddress = (address) => {
    return new Promise(async (resolve, reject) => {
        try {
            let existedAddresses = await db.DeliveryAddress.findAll({
                where: {
                    customerId: address.customerId,
                },
            });

            // if nothing change -> invalid
            existedAddresses.forEach((existedAddress) => {
                if (
                    existedAddress.details == address.details &&
                    existedAddress.ward == address.ward &&
                    existedAddress.district == address.district &&
                    existedAddress.province == address.province
                ) {
                    resolve({
                        code: ResponseCode.DATABASE_ERROR,
                        message: "Delivery address already in use.",
                    });
                }
            });

            // if new address -> create
            if (address.isDefault == true || address.isDefault == "true") {
                await db.DeliveryAddress.update(
                    { isDefault: false },
                    {
                        where: { customerId: address.customerId },
                    },
                );
            }

            await db.DeliveryAddress.create({
                customerId: address.customerId,
                details: address.details,
                ward: address.ward,
                district: address.district,
                province: address.province,
                receiverName: address.receiverName,
                receiverPhoneNumber: address.receiverPhoneNumber,
                isDefault: address.isDefault,
            });

            resolve({
                code: ResponseCode.SUCCESS,
                message: "Create delivery address successfully.",
                result: address,
            });
        } catch (error) {
            reject(error);
        }
    });
};

/** UPDATE DELIVERY ADDRESS */

let handleUpdateDeliveryAddress = (newAddress) => {
    return new Promise(async (resolve, reject) => {
        try {
            let address = await db.DeliveryAddress.findOne({
                where: {
                    id: newAddress.id,
                    customerId: newAddress.customerId,
                },
            });

            // if not exist -> invalid
            if (!address) {
                resolve({
                    code: ResponseCode.FILE_NOT_FOUND,
                    message: "Invalid delivery address.",
                });
            }

            // if exist -> update
            else {
                if (address.isDefault === true || address.isDefault === "true") {
                    await db.DeliveryAddress.update(
                        { isDefault: false },
                        {
                            where: { customerId: address.customerId },
                        },
                    );
                }

                await db.DeliveryAddress.update(
                    {
                        details: newAddress.details,
                        ward: newAddress.ward,
                        district: newAddress.district,
                        province: newAddress.province,
                        receiverName: newAddress.receiverName,
                        receiverPhoneNumber: newAddress.receiverPhoneNumber,
                        isDefault: newAddress.isDefault,
                    },
                    {
                        where: {
                            id: newAddress.id,
                            customerId: newAddress.customerId,
                        },
                    },
                );

                resolve({
                    code: ResponseCode.SUCCESS,
                    message: "Update delivery address successfully.",
                    result: newAddress,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

/** DELETE DELIVERY ADDRESS */

let handleDeleteDeliveryAddress = (addressId, customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (addressId === "all") {
                await db.DeliveryAddress.destroy({
                    where: {
                        customerId: customerId,
                    },
                });
                resolve({
                    code: ResponseCode.SUCCESS,
                    message: "Delete all delivery address successfully.",
                });
            }

            let currentAddress = await db.DeliveryAddress.findOne({
                where: {
                    id: addressId,
                    customerId: customerId,
                },
            });

            // if not exist -> invalid
            if (!currentAddress) {
                resolve({
                    code: ResponseCode.FILE_NOT_FOUND,
                    message: "Invalid delivery address.",
                });
            }

            // if exist -> delete
            else {
                await db.DeliveryAddress.destroy({
                    where: {
                        id: addressId,
                        customerId: customerId,
                    },
                });
                resolve({
                    code: ResponseCode.SUCCESS,
                    message: "Delete delivery address successfully.",
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleGetDeliveryAddress,
    handleCreateDeliveryAddress,
    handleUpdateDeliveryAddress,
    handleDeleteDeliveryAddress,
};

// update limit 5 addresses
