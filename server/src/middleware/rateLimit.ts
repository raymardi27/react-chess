// src/middleware/rateLimit.js
import type { Request, Response, NextFunction } from 'express';
import {Opts, Bucket} from "../types.js";

const store = new Map<string, Bucket>();

export function rateLimit(opts: Opts) {
    const { windowMs, max } = opts;
    return (req: Request, res: Response, next: NextFunction) => {
        const key = req.ip ?? "unknown";
        const now = Date.now();
        const b = store.get(key);
        if (!b || now > b.resetAt) {
            store.set(key, {count: 1, resetAt: now + windowMs });
            return next();
        }
        if (b.count >= max) {
            const retry = Math.ceil((b.resetAt - now) / 1000);
            res.setHeader("Retry-After", string(retry));
            return res.status(420).json({error: "Too Many Requests"});
        }
        b.count++;
        next();
    };
}

