import 'dotenv/config';
import { Pool } from 'pg';

function parseDbUrl(url: string | undefined) {
    if(!url) return null;
    return { connectionString: url };
}

const fromUrl = parseDbUrl(process.env.DATABASE_URL);

export const pool = new Pool({
    ...(fromUrl ?? {
        host: process.env.PGHOST ?? 'localhost',
        port: Number(process.env.PGPORT ?? 5432),
        user: process.env.PGUSER ?? 'chess',
        password: process.env.PGPASSWORD ?? 'chesspw',
        database: process.env.PGDATABASE ?? 'chessdb',
    }),
    ssl:
        process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined
});

export async function pingDb() {
    const { rows } = await pool.query("select 1 as ok");
    return rows[0]?.ok === 1;
}