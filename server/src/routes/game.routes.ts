import {Router} from "express";
import * as GameController from "../controllers/game.controllers.js";

const router = Router();

router.get("/:id", GameController.getById);

export default router;