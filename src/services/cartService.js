import { ResponseCode } from "../constant";
import db from "../models";

/** GET DELIVERY ADDRESS */

let handleGetCart = (customerId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!customerId) {
                resolve({
                    code: ResponseCode.MISSING_PARAMETER,
                    message: "Missing parameter(s).",
                });
            }

            let cart = await db.Cart.findAll({
                where: { customerId: customerId },
                order: [["id", "DESC"]],
            });

            //if not exist -> invalid
            if (!cart) {
                resolve({
                    code: ResponseCode.FILE_NOT_FOUND,
                    message: "Nothing in the cart",
                });
            }

            // if exist -> array[]
            else {
                resolve({
                    code: ResponseCode.SUCCESS,
                    message: "Get cart items successfully",
                    result: cart,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

/** CREATE NEW DELIVERY ADDRESS */

let handleUpdateCart = (item) => {
    return new Promise(async (resolve, reject) => {
        try {
            let cartItem = await db.Cart.findOne({
                where: {
                    customerId: item.customerId,
                    productId: item.productId,
                },
            });

            // if existed -> add or subtract
            if (cartItem) {
                if (item.quantity === 0) {
                    await db.Cart.destroy({
                        where: {
                            customerId: item.customerId,
                            productId: item.productId,
                        },
                    });

                    resolve({
                        code: ResponseCode.SUCCESS,
                        message: "Update cart successfully.",
                    });
                } else {
                    await db.Cart.update(
                        {
                            quantity: item.quantity,
                        },
                        {
                            where: {
                                customerId: item.customerId,
                                productId: item.productId,
                            },
                        },
                    );

                    resolve({
                        code: ResponseCode.SUCCESS,
                        message: "Update cart successfully.",
                    });
                }
            }
            // if not existed -> create new
            await db.CartItems.create({
                customerId: item.customerId,
                productId: item.productId,
                quantity: item.quantity,
            });

            resolve({
                code: ResponseCode.SUCCESS,
                message: "Update cart successfully.",
            });
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleGetCart,
    handleUpdateCart,
};
