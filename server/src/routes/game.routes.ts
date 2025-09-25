import {Router} from "express";
import * as GameController from "../controllers/game.controller.js";

const router = Router();

router.get("/:id", GameController.getById);

export default router;