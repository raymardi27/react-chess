import { pool } from '../db/pool.js';

import {DBUser} from "../types.js"

// DBUser = {
//     id: number;
//     email:string;
//     username: string | null;
//     password_hash: string;
//     created_at: Date;
//     updated_at: Date;
// };

export async function getByEmail(email: string): Promise<DBUser | null> {
    const {rows} = await pool.query<DBUser>(
        `select id, username, email, password as password_hash, created_at, updated_at
        from users 
        where email = $1`,
        [email]
    );
    return rows[0] ?? null;
}

export async function getById(id: Number): Promise<DBUser | null> {
    const {rows} = await pool.query<DBUser>(
        `select *
        from users 
        where id = $1`,
        [id]
    );
    return rows[0] ?? null;
}

export async function createUser(
    email: string,
    password_hash: string,
    username: string | null
): Promise<DBUser> {
    const {rows} = await pool.query<DBUser>(
        `insert into users (email, password, username)
        values ($1, $2, $3)
        returning id, email, username, created_at, updated_at`,
        [email, password_hash, username]
    );
    return rows[0];
}