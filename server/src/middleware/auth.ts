import type { Request, Response, NextFunction } from 'express';
import {jwtVerify} from 'jose';


// light cookie parser
function getCookie(req:Request, name: string): string | undefined {
    const raw = req.headers.cookie;
    if (!raw) return undefined;
    const parts = raw.split(/; */);
    for (const p of parts) {
        const [k,v] = p.split("=");
        if (decodeURIComponent(k) === name) return decodeURIComponent(v || "");
    }
    return undefined;
}

function secret(): Uint8Array {
    const s = process.env.JWT_SECRET || "dev_secret";
    return new TextEncoder().encode(s);
}

// Require valid JWT 
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const bearer = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice("Bearer ".length)
        : undefined;

        const token = bearer || getCookie(req, "access_token");
        if(!token) return res.status(401).json({error: "Unauthorized"});

        const { payload } = await jwtVerify(token, secret());
        (req as any).user = {sub: string(payload.sub), email: payload.email };
        next();
    } catch {
        res.status(401).json({ error: "Unauthorized" });
    }
}