import db from "../models";

let handleGetProduct = (categoryId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = {};
            if (categoryId && categoryId === "all") {
                let products = await db.Product.findAll({
                    order: [["id", "DESC"]],
                });
                data.code = 0;
                data.message = "get product(s) success";
                data.result = products;
            }
            if (categoryId && categoryId !== "all") {
                let product = await db.Product.findAll({
                    where: { categoryId: categoryId },
                    order: [["id", "DESC"]],
                });
                if (product) {
                    data.code = 0;
                    data.message = "get product(s) success";
                    data.result = product;
                } else {
                    data.code = 2;
                    data.message = "get product(s) failed: category incorrect";
                }
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleCreateProduct = (product) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        await db.Product.create({
            name: product.name,
            categoryId: product.categoryId,
            imageUrl: product.imageUrl,
            unit: product.unit,
            size: product.size,
            oldPrice: product.oldPrice,
            newPrice: product.newPrice,
            description: product.description,
        });
        data.code = 0;
        data.message = "successfully";
        try {
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleUpdateProduct = (product) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetProduct = await db.Product.findOne({
                where: { id: product.id },
            });
            if (targetProduct) {
                await db.Product.update(
                    {
                        name: product.name,
                        categoryId: product.categoryId,
                        imageUrl: product.imageUrl,
                        unit: product.unit,
                        size: product.size,
                        oldPrice: product.oldPrice,
                        newPrice: product.newPrice,
                        description: product.description,
                    },
                    {
                        where: { id: product.id },
                    },
                );
                data.code = 0;
                data.message = "update product success";
            } else {
                data.code = 1;
                data.message = "invalid product";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

let handleDeleteProduct = (productId) => {
    return new Promise(async (resolve, reject) => {
        let data = {};
        try {
            let targetProduct = await db.Product.findOne({
                where: { id: productId },
            });
            if (targetProduct) {
                await db.Product.destroy({
                    where: { id: productId },
                });
                data.code = 0;
                data.message = "delete product success";
            } else {
                data.code = 1;
                data.message = "invalid product";
            }
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
};

export default {
    handleGetProduct,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
};
