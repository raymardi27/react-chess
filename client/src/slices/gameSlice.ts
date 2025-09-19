import {createSlice, type PayloadAction} from '@reduxjs/toolkit';


type Move = { 
    from: string;
    to: string;
    promotion?: string
};

type GameState = {
    status: "idle" | "matching" | "playing" | "ended";
    gameId?: string;
    color?: "white" | "black";
    fen: string;
    turn: "w" | "b" | null;
    lastMove?: any;
    winner?: "white" | "black" | "draw";
};

const initialState: GameState = {
    status: "idle",
    fen: "startpos",
    turn: null
};

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        lookingForMatch(state) {state.status = "matching";},
        matchFound(state, action: PayloadAction<{gameId: string; color: "white" | "black"}>) {
            state.status = "playing";
            state.gameId = action.payload.gameId;
            state.color = action.payload.color;
        },
        serverState(state, action: PayloadAction<{fen: string; turn: "w" | "b"; move?: any; gameOver?: boolean }>) {
            state.fen = action.payload.fen;
            state.turn = action.payload.turn;
            state.lastMove = action.payload.move;
            if (action.payload.gameOver) state.status = "ended";
        },
        ended(state, action: PayloadAction<{ reason: string; winner: "white" | "black" | "draw" }>) {
            state.status = "ended";
            state.winner = action.payload.winner;
        },
        attemptMove(_state, _action: PayloadAction<Move>) {}
    }
});

export const { lookingForMatch, matchFound, serverState, ended, attemptMove } = gameSlice.actions;
export default gameSlice.reducer;