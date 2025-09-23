// src/middleware/rateLimit.js
import type { Request, Response, NextFunction } from 'express';

export function rateLimit(options: {
    windowMs: number;
    max: number;
    message?: string;
}): (req: Request, res: Response, next: NextFunction) => void {
    const requests = new Map();

    return (req, res, next) => {
        const now = Date.now();
        const windowStart = now - options.windowMs;
        const ip = req.ip;

        if (!requests.has(ip)) {
            requests.set(ip, []);
        }

        const timestamps = requests.get(ip).filter((timestamp: number) => timestamp > windowStart);
        timestamps.push(now);
        requests.set(ip, timestamps);

        if (timestamps.length > options.max) {
            return res.status(429).json({ error: options.message || 'Too many requests, please try again later.' });
        }

        next();
    };
}