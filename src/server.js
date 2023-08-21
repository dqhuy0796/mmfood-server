import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import connectDatabase from "./config/connectdb.js";
import initWebRoutes from "./routes/web.js";

dotenv.config();

const app = express();

app.use(cors({ origin: true }));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

initWebRoutes(app);

connectDatabase();

let port = process.env.NODE_SERVER_PORT || 9876;

app.listen(port);
