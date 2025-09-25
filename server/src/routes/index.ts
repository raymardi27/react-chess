import { Router } from 'express';
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import gameRoutes from "./game.routes.js";

const router = Router();

// live or not
router.get("/health", (_req, res) => res.json({ok: true}));

// feature routers
router.use("/auth", authRoutes);
router.use("/users",userRoutes);
router.use("/games",gameRoutes);

export default router;