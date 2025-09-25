import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import * as UserController from "../controllers/user.controller.js";

const router = Router();

router.get("/getSelf", requireAuth, UserController.getSelf);

export default router;