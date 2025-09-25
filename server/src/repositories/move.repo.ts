import { pool } from "../db/pool.js";
import { DBMove } from "../types.js"

export async function listByGame(gameId: string): Promise<DBMove[]> {
    const { rows } = await pool.query<DBMove>(
        `select *
        from moves
        where game_id = $1
        order by ply asc`,
        [gameId]
    );
    return rows;
}