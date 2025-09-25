import type { CorsOptions } from "cors";
import { env } from "./env.js";

export function corsOptions(): CorsOptions {
    // Allowing comma sep origins or "*"
    const origin = 
        env.CORS_ORIGIN === "*"
        ? true
        : env.CORS_ORIGIN.split(",").map(s => s.trim());
    
    return {
        origin,
        credentials: true
    };
}