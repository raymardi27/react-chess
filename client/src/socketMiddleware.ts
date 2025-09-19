import {io, Socket} from "socket.io-client";
import type {Middleware} from "@reduxjs/toolkit";
import {attemptMove, lookingForMatch, matchFound, serverState, ended} from "./slices/gameSlice";

let socket: Socket | null = null;

export const socketMiddleware: Middleware = store => next => action => {
    if (!socket) {
        socket = io("http://localhost:4000");

        socket.on("matchFound", (data) => store.dispatch(matchFound(data)));
        socket.on("state", (data) => store.dispatch(serverState(data)));
        socket.on("gameOver", (data) => store.dispatch(ended(data)));
    }

    if (lookingForMatch.match(action)) {
        socket.emit("joinQueue");
    }

    if (attemptMove.match(action)) {
        const state = store.getState() as any;
        const gameId = state.game.gameId;
        socket.emit("move", {gameId, ...action.payload});
    }

    return next(action);
};