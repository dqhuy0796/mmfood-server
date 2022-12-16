import bodyParser from "body-parser";
import express from "express";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
import connectDatabase from "./config/connectDatabase";
import cors from "cors";

require("dotenv").config();

let app = express();
app.use(cors({ origin: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDatabase();

let port = process.env.PORT || 9999;

app.listen(port, () => {
    console.log(port);
});
