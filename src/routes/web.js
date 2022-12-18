import express from "express";
import userController from "../controllers/userController";
import productController from "../controllers/productController";
import postController from "../controllers/postController";
import homeController from "../controllers/homeController";
import adminController from "../controllers/adminController";
import authController from "../controllers/authController";
import customerController from "../controllers/customerController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomepage);

    router.post("/api/admin/login", adminController.adminLogin);

    router.post("/api/login", authController.login);
    router.post("/api/register", authController.register);

    router.get("/api/user/get", userController.getUser);
    router.post("/api/user/create", userController.createUser);
    router.put("/api/user/update", userController.updateUser);
    router.delete("/api/user/delete", userController.deleteUser);

    router.get("/api/customer/get", customerController.getCustomer);
    router.post("/api/customer/create", customerController.createCustomer);
    router.put("/api/customer/update", customerController.updateCustomer);
    router.delete("/api/customer/delete", customerController.deleteCustomer);

    router.get("/api/product/get", productController.getProduct);
    router.post("/api/product/create", productController.createProduct);
    router.put("/api/product/update", productController.updateProduct);
    router.delete("/api/product/delete", productController.deleteProduct);

    router.get("/api/posts/get", postController.getPost);
    router.post("/api/posts/create", postController.createPost);
    router.put("/api/posts/update", postController.updatePost);
    router.delete("/api/posts/delete", postController.deletePost);

    return app.use("/", router);
};

module.exports = initWebRoutes;
