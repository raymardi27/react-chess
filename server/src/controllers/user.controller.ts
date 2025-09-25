import type {Request, Response} from "express";
import * as UserService from "../services/user.service.js";

export async function getSelf(req: Request, res: Response) {
    const sub = (req as any).user?.sub; // set by requireAuth
    const id = sub ? Number(sub) : undefined;
    
    if (!id) {
        return res.status(401).json({error: "Unauthorized"});
    }

    const user = await UserService.getSelf(id);
    if (!user) {
        return res.status(404).json({error: "User not Found"});
    }

    res.json({user});
}