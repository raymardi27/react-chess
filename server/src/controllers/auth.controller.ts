import type { Request, Response } from "express";
import * as AuthService from "../services/auth.service.js";
import { runInNewContext } from "vm";

// cookie name and options
const COOKIE_NAME = "access_token";
function cookieOpts() {
    const isProd = process.env.NODE_ENV === "production";
    return {
        httpOnly: true as const,
        sameSite: "lax" as const,
        secure: isProd,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
}

export async function signup(req: Request, res: Response) {
    const { email, username, password } = req.body as {
        email: string;
        username: string;
        password: string;
    };

    const { user, jwt } = await AuthService.signup(email, username, password);
    res.cookie(COOKIE_NAME, jwt, cookieOpts());
    res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
    const {email, password } = req.body as { email: string, password: string };
    const { user, jwt } = await AuthService.login(email, password);
    res.cookie(COOKIE_NAME, jwt, cookieOpts());
    res.json({ user });
}

export async function logout(_req: Request, res: Response) {
    res.cookie(COOKIE_NAME, "", {...cookieOpts(), maxAge: 0});
    res.status(204).send();
}