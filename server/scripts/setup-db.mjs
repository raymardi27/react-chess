import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function sh(cmd, args, opts = {}) {
    return new Promise((res, rej) => {
        const p = spawn(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32', ...opts});
        p.on('close', (code) => (code === 0 ? res(): rej(new Error(`${cmd} ${args.join(' ')} -> ${code}`))));
    });
}

async function waitForDb() {
    const { Pool } = await import('pg');
    const { config } = await import('dotenv');
    config({ path: resolve(__dirname, '..', '.env') });

    const pool = new Pool({
        host: process.env.PGHOST || 'localhost',
        port: Number(process.env.PGPORT || 5432),
        user: process.env.PGUSER || 'chess',
        password: process.env.PGPASSWORD || 'chesspw',
        database: process.env.PGDATABASE || 'chessdb',
    });

    let attempts = 30;
    while (attempts--) {
        try { await pool.query('select 1'); await pool.end(); return;}
        catch { await new Promise(r => setTimeout(r, 1000));}
    }

    await pool.end();
    throw new Error('Postgres was not ready in time');
}

async function main() {

    // start DB
    await sh('focker', ['compose','-f', 'docker-compose.dev.yml','up','-d'], {cwd: resolve(__dirname, '..')});
    
    // wait for it to be ready
    await waitForDb();
    console.log('Postgres is ready');

    // run migrations
    await sh('npm', ['run','db:migrate'], {cwd: resolve(__dirname, '..')});

    console.log('DB Ready');
}

main().catch((e) => {console.error(e); process.exit(1);});