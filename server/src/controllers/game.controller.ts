import type { Request, Response } from "express";
import * as GameService from "../services/game.service.js";

export async function getById(req: Request, res: Response) {
    const id= String(req.params.id);
    const data = await GameService.getGameWithMoves(id);
    if (!data) {
        return res.status(404).json({error: "Game Not Found"});
    }
    res.json(data);
}