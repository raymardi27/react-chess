import { pool } from '../db/pool.js';

export type DBUser = {
    id: number;
    email:string;
    username: string | null;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
};

export async function getByEmail(email: string): Promise<DBUser | null> {
    const {rows} = await pool.query<DBUser>(
        `select *
        from users 
        where email = $1`,
        [email]
    );
    return rows[0] ?? null;
}

export async function getById(id: number): Promise<DBUser | null> {
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
        `insert into users (email, password_hash, username)
        values ($1, $2, $3)
        returning id, email, username, created_at, updated_at`,
        [email, password_hash, username]
    );
    return rows[0];
}