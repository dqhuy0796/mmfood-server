import express from "express";
import userController from "../controllers/userController";
import homeController from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomepage);

    router.post("/api/login", userController.handleAuthenticate);

    return app.use("/", router);
};

module.exports = initWebRoutes;
