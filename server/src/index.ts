
import express from "express";
import cors from "cors";
import http from "http";
import routes from "./routes/index.js";
import { Server } from "socket.io";
import { Chess } from "chess.js";
import app from "./app.js";

const server = http.createServer(app);
const io = new Server(server, {cors: {origin: "*"}});

type Game = {
    id: string;
    chess: Chess;
    white: string;
    black: string;
};

const queue: string[] = [];
const games = new Map<string, Game>();

// Queue Matching
function matchMake() {
    while (queue.length >= 2) {
        const white = queue.shift()!;
        const black = queue.shift()!;
        const gameId = Math.random().toString(36).slice(2);
        const chess = new Chess();
        const game: Game = {id: gameId, chess, white, black };
        games.set(gameId, game);

        io.to(white).emit("matchFound", {gameId, color: "white"});
        io.to(black).emit("matchFound", {gameId, color: "black"});
        io.to(white).emit("state", {fen: chess.fen(), turn: chess.turn()});
        io.to(black).emit("state", {fen: chess.fen(), turn: chess.turn()});
    }
}

io.on("connection", (socket) => {
    socket.on("joinQueue", () =>{
        if (!queue.includes(socket.id)) queue.push(socket.id);
        matchMake();
    });

    socket.on("move", ({gameId, from, to, promotion}) => {
        const game = games.get(gameId);
        if(!game) return;

        const playerColor = socket.id === game.white ? "w" : socket.id === game.black ? "b" : null;
        if (!playerColor) return;

        if (game.chess.turn() !== playerColor) return; // not your turn lol

        const move = game.chess.move({from, to, promotion});
        if (!move) return; // illegal moves fround upon

        const payload = { fen: game.chess.fen(), move, turn: game.chess.turn(), over: game.chess.isGameOver() };
        io.to(game.white).emit("state", payload);
        io.to(game.black).emit("state", payload);
    });

    socket.on("resign", ({ gameId}) => {
        const game = games.get(gameId);
        if (!game) return;

        const winner = socket.id === game.white ? "black" : "white";
        io.to(game.white).emit("gameOver", {reason: "resignation", winner});
        io.to(game.black).emit("gameOver", {reason: "resignation", winner});
        games.delete(gameId);
    });

    socket.on("disconnect", () => {
        const qi = queue.indexOf(socket.id);
        if (qi >= 0) queue.splice(qi, 1);
        // TODO: handle disconnects
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

