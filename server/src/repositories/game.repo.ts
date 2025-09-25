import { pool } from "../db/pool.js";
import { DBGame } from "../types.js";

export async function getById(id: string): Promise<DBGame | null> {
    const {rows} = await pool.query<DBGame>(
        `select *
        from games
        where id = $1
        limit 1`,
        [id]
    );
    return rows[0] ?? null;
}