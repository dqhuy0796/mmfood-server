import productService from "../services/productService";

let getProduct = async (req, res) => {
    if (req.query.id) {
        let categoryId = req.query.id;
        let data = await productService.handleGetProduct(categoryId);
        return res.status(200).json({
            code: data.code,
            message: data.message,
            result: data.result ? data.result : [],
        });
    }
    return res.status(200).json({
        code: 1,
        message: "missing parameter(s)",
    });
};

let createProduct = async (req, res) => {
    let product = {};
    product.name = req.body.name;
    product.categoryId = req.body.categoryId;
    product.imageUrl = req.body.imageUrl;
    product.unit = req.body.unit;
    product.size = req.body.size;
    product.oldPrice = req.body.oldPrice;
    product.newPrice = req.body.newPrice;
    product.description = req.body.description;

    let data = await productService.handleCreateProduct(product);

    return res.status(200).json({
        code: data.code,
        message: data.message,
    });
};

let updateProduct = async (req, res) => {
    let product = {};
    product.id = req.body.id;
    product.name = req.body.name;
    product.categoryId = req.body.categoryId;
    product.imageUrl = req.body.imageUrl;
    product.unit = req.body.unit;
    product.size = req.body.size;
    product.oldPrice = req.body.oldPrice;
    product.newPrice = req.body.newPrice;
    product.description = req.body.description;

    let data = await productService.handleUpdateProduct(product);

    return res.status(200).json({
        code: data.code,
        message: data.message,
    });
};

let deleteProduct = async (req, res) => {
    if (req.body.id) {
        let data = await productService.handleDeleteProduct(req.body.id);
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
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
};
