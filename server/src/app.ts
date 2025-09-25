import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { notFound, errorHandler } from "./middleware/error.js";
import "./config/env.js";
import {corsOptions} from "./config/cors.js";

const app = express();
app.use(cors(corsOptions()));
app.use(express.json());

// Mount API 
app.use("/api",routes);

// error handlers
app.use(notFound);
app.use(errorHandler);
export default(app);