import express from "express";
import userController from "../controllers/userController";
import productController from "../controllers/productController";
import postController from "../controllers/postController";
import homeController from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomepage);

    router.post("/api/login", userController.login);

    router.get("/api/user/get", userController.getUser);
    router.post("/api/user/create", userController.createUser);
    router.put("/api/user/update", userController.updateUser);
    router.delete("/api/user/delete", userController.deleteUser);

    router.get("/api/product/get", productController.getProduct);
    router.post("/api/product/create", productController.createProduct);
    router.put("/api/product/update", productController.updateProduct);
    router.delete("/api/product/delete", productController.deleteProduct);

    router.get("/api/post/get", postController.getPost);
    router.post("/api/post/create", postController.createPost);
    router.put("/api/post/update", postController.updatePost);
    router.delete("/api/post/delete", postController.deletePost);

    return app.use("/", router);
};

module.exports = initWebRoutes;
