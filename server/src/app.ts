import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();
app.use(cors({origin: process.env.CORS_ORIGIN?.split(",") ?? true, credentials: true}));
app.use(express.json());
app.use("/api",routes);
// error handlers
import { notFound, errorHandler } from "./middleware/error.js";
app.use(notFound);
app.use(errorHandler);
export default(app);