import { promises as fs } from 'node:fs';
import path from 'node:path';
import { pool } from './pool.js';

async function ensureMigrationsTable() {
    await pool.query(`
        create table if not exists schema_migrations (
        id serial primary key,
        filename text not null unique,
        applied_at timestamptz not null default now()
    );
    `);
}

async function appliedSet(): Promise<Set<string>> {
    const {rows } = await pool.query('select filename from schema_migrations');
    return new Set(rows.map(r => r.filename as string));
}

async function applyMigration(filePath: string, filename: string) {
    const sql = await fs.readFile(filePath, 'utf8');
    const client = await pool.connect();
    try {
        await client.query('begin');
        await client.query(sql);
        await client.query('insert into schema_migrations(filename) values($1)', [filename]);
        await client.query('commit');
        console.log(`Applied ${filename}`);
    } catch (e) {
        await client.query('rollback');
        console.error(`Failed to apply ${filename}`);
        throw e;
    } finally {
        client.release();
    }
}

async function main() {
    const dir = path.resolve(process.cwd(), 'migrations');
    await ensureMigrationsTable();

    const files = (await fs.readdir(dir))
        .filter(f => f.endsWith('.sql'))
        .sort();
    
    const done = await appliedSet();
    for ( const f of files) {
        if (done.has(f)) continue;
        await applyMigration(path.join(dir, f), f);
    }

    console.log(' Migrations Complete');
    await pool.end();
}

main().catch(async (e) => {
    console.error(e);
    await pool.end();
    process.exit(1);
});