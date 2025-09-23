import { Router } from 'express';
import authRoutes from "./auth.routes.js";

const router = Router();

// live or not
router.get("/health", (_req, res) => res.json({ok: true}));

// feature routers
router.use("/auth", authRoutes);

export default router;