-- Users 
create table if not exists users (
    id bigserial primary key,
    username text unique,
    email text unique not null,
    password text not null,
    created_at timestamptz not null default now()
);

-- Games having individual ids
create table if not exists games (
    id text primary key,
    white_user_id bigint references users(id),
    black_user_id bigint references users(id),
    status text not null,
    fen text not null,
    result text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    ended_at timestamptz
);
create index if not exists game_status_idx on game(status);

-- Move list for games
create table if not exists moves (
    id bigserial primary key,
    game_id text not null references games(id) on delete cascade,
    ply int not null,
    san text not null,
    from_square text not null,
    to_square text not null,
    fen_after text not null,
    created_at timestamptz not null default now()
);
create index if not exists moves_game_idx on moves(game_id);