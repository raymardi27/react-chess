// User types
export type PublicUser = { id: string, email: string, username: string | null; createdAt: string, updatedAt: string };

export type AuthUser = {sub: string; email?: string };

export type DBUser = {
    id: Number;
    email:string;
    username: string | null;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
};

// Game types
import {Chess} from "chess.js";
export type DBGame = {
    id: string;
    status: string;
    fen: string;
    result: string | null;
    created_at: Date;
    updated_at: Date;
    ended_at: Date;
    white_user_id: Number | null;
    black_user_id: Number | null;
};

export type Game = {
    id: string; 
    chess: Chess; 
    white: string; 
    black: string 
}

export type DBMove = {
    id: number;
    game_id: string;
    ply: number;
    san: string;
    from_square: string;
    to_square: string;
    fen_after: string;
    created_at: Date;
}

// Utility Types

export type Opts = { windowMs: number; max: number};

export type Bucket = { count: number; resetAt: number };

export type Rule = {
    type: "string" | "email";
    required?: boolean;
    min?: number;
    max?: number;
};

export type Schema = Record<string, Rule>;

export type Color = "white" | "black";

export type Result = "1-0" | "0-1" | "1/2-1/2";