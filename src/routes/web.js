import express from "express";
import userController from "../controllers/userController";
import productController from "../controllers/productController";
import postController from "../controllers/postController";
import homeController from "../controllers/homeController";
import adminController from "../controllers/adminController";
import authController from "../controllers/authController";
import customerController from "../controllers/customerController";
import orderController from "../controllers/orderController";
import verifyAccessToken from "../middleware/verifyAccessToken";
import deliveryAddressController from "../controllers/deliveryAddressController";
import verifyRefreshToken from "../middleware/verifyRefreshToken";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomepage);

    /** ADMIN */

    router.post("/api/admin/login", adminController.adminLogin);

    /** AUTH */

    router.post("/api/auth/user/login", authController.userLogin);
    router.post("/api/auth/user/refresh", authController.userRefresh);
    router.post("/api/auth/user/changepassword", verifyAccessToken, authController.changeUserPassword);

    router.post("/api/auth/customer/login", authController.customerLogin);
    router.post("/api/auth/customer/register", authController.customerRegister);
    router.post("/api/auth/customer/verify-refresh-token", authController.customerVerifyRefreshToken);
    router.post("/api/auth/customer/refresh", verifyRefreshToken, authController.customerRefreshTokens);
    router.put("/api/auth/customer/update", verifyAccessToken, authController.customerUpdateProfile);
    router.post("/api/auth/customer/change-password", verifyAccessToken, authController.changeCustomerPassword);

    /** USER */

    router.get("/api/user/get", verifyAccessToken, userController.getUser);
    router.post("/api/user/create", verifyAccessToken, userController.createUser);
    router.put("/api/user/update", verifyAccessToken, userController.updateUser);
    router.delete("/api/user/delete", verifyAccessToken, userController.deleteUser);

    /** ORDER */

    router.get("/api/order/get", verifyAccessToken, orderController.getOrder);
    router.post("/api/order/create", verifyAccessToken, orderController.createOrder);
    router.post("/api/order/confirm", verifyAccessToken, orderController.confirmOrder);
    router.post("/api/order/delivery", verifyAccessToken, orderController.deliveryOrder);
    router.post("/api/order/finished", verifyAccessToken, orderController.finishedOrder);
    router.post("/api/order/cancel", verifyAccessToken, orderController.cancelOrder);

    /** CUSTOMER */

    router.get("/api/customer/get", verifyAccessToken, customerController.getCustomer);
    router.post("/api/customer/create", verifyAccessToken, customerController.createCustomer);
    router.put("/api/customer/update", verifyAccessToken, customerController.updateCustomer);
    router.delete("/api/customer/delete", verifyAccessToken, customerController.deleteCustomer);

    /** DELIVERY ADDRESS */

    router.get("/api/address/get", verifyAccessToken, deliveryAddressController.getDeliveryAddress);
    router.post("/api/address/create", verifyAccessToken, deliveryAddressController.createDeliveryAddress);
    router.put("/api/address/update", verifyAccessToken, deliveryAddressController.updateDeliveryAddress);
    router.delete("/api/address/delete", verifyAccessToken, deliveryAddressController.deleteDeliveryAddress);

    /** PRODUCTS */

    router.get("/api/product/get", productController.getProduct);
    router.post("/api/product/create", verifyAccessToken, productController.createProduct);
    router.put("/api/product/update", verifyAccessToken, productController.updateProduct);
    router.delete("/api/product/delete", verifyAccessToken, productController.deleteProduct);
    // router.get("/api/search", authController.search);

    /** BLOG */

    router.get("/api/posts/get", postController.getPost);
    router.post("/api/posts/create", verifyAccessToken, postController.createPost);
    router.put("/api/posts/update", verifyAccessToken, postController.updatePost);
    router.delete("/api/posts/delete", verifyAccessToken, postController.deletePost);

    /** APPLY ROUTER */

    return app.use("/", router);
};

module.exports = initWebRoutes;
