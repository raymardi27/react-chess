// src/middleware/validate.js
import type { Request, Response, NextFunction } from 'express';

import { Schema } from "../types.js"

function isEmail(s: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(s);
}

export function validateBody(schema: Schema): (req: Request, res: Response, next: NextFunction) => void {
    return (req, res, next) => {
        const errors: Record<string, string> = {};
        const body = req.body ?? {};

        for (const [key, rule] of Object.entries(schema)) {
            const val = body[key];

            if (rule.required && (val === undefined || val == null || val === "")) {
                errors[key] = "required";
                continue;
            }

            if (val === undefined || val === null) continue;

            if (rule.type === "string" && typeof val !== "string") {
                errors[key] = "must be a string";
                continue;
            }

            if (rule.type === "email") {
                if (typeof val !== "string" || !isEmail(val)) {
                    errors[key] = "must be a valid email";
                    continue;
                }
            }

            if (typeof val === "string") {
                if (rule.min && val.length < rule.min) errors[key] = `min length ${rule.min}`;
                if (rule.max && val.length > rule.max) errors[key] = `max length ${rule.max}`;
            }
        }

        if (Object.keys(errors).length) return res.status(400).json({ errors });
        next();
    };
}