import type { Server as HTTPServer} from "node:http";
import { Server } from "socket.io"
import { registerGameSocket } from "./game.socket.js";

export function initSockets(httpServer: HTTPServer) {
    const origin = 
        process.env.CORS_ORIGIN === "*"
        ? true
        : (process.env.CORS_ORIGIN ?? "").split(",").map(s => s.trim());
    
    const io = new Server(httpServer, {
        cors: {origin, credentials: true},
    });

    registerGameSocket(io)
}