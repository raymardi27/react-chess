import * as Users from "../repositories/user.repo.js";
import { PublicUser } from "../types.js";

export async function getSelf(id: Number): Promise<PublicUser | null> {
    const u = await Users.getById(id);
    if(!u) return null;
    return {
        id:String(u.id),
        email: u.email,
        username: u.username,
        createdAt: u.created_at.toISOString(),
        updatedAt: u.updated_at.toISOString()
    }
}