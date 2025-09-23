import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { SignJWT, jwtVerify } from "jose";
import * as Users from "../repositories/user.repo.js";

const scrypt = promisify(_scrypt) as (
    password: string | Buffer,
    salt: string | Buffer,
    keylen: number
) => Promise<Buffer>;

type PublicUser = { id: string, email: string, username: string | null; createdAt: string, updatedAt: string };

// Password hashing
async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16);
    const hash = await scrypt(password, salt, 64);
    return `s1$${salt.toString("hex")}$${hash.toString("hex")}`;
}

// Password verification
async function verifyPassword(password: string, stored: string): Promise<boolean> {
    const [ scheme, saltHex, hashHex ] = stored.split("$");
    if (scheme !== "s1") return false;
    const salt = Buffer.from(saltHex, "hex");
    const hash = Buffer.from(hashHex, "hex");
    const test = await scrypt(password, salt, hash.length);
    return timingSafeEqual(hash,test);
}

// JWT Time
function jwtSecret(): Uint8Array {
    const secret = process.env.JWT_SECRET;
    return new TextEncoder().encode(secret);
}

export async function signJwt(payload: object, expiresIn= "7d"): Promise<string> {
    return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(jwtSecret());
}

export async function verifyJwt<T = any>(token: string): Promise<T> {
    const { payload } = await jwtVerify(token, jwtSecret());
    return payload as T;
}

// public Mapping -- apparently a convenient way to see what the mapping is for the public
function toPublic(u: Users.DBUser): PublicUser {
    return {
        id: String(u.id),
        email: u.email,
        username: u.username,
        createdAt: u.created_at.toISOString(),
        updatedAt: u.updated_at.toISOString()
    };
}

// Main Flows
export async function signup(email: string, username: string, password: string) {
    const existing = await Users.getByEmail(email);
    if (existing) {
        const e = new Error("Email is already registered");
        (e as any).status = 409;
        throw e;
    }
    const password_hash = await hashPassword(password);
    const user = await Users.createUser(email, password_hash, username);
    const jwt = await signJwt({sub: String(user.id), email: user.email});
    return {user: toPublic(user), jwt};
}

export async function login(email: string, password: string) {
    const user = await Users.getByEmail(email);
    const bad = (val: string) => {
        const e = new Error(`${val}`);
        (e as any).status = 401;
        throw e;
    }
    if (!user) bad("user not found");
    const ok = await verifyPassword(password, user!.password_hash);
    if (!ok) bad("invalid password");
    const jwt = await signJwt({ sub: String(user!.id), email: user!.email });
    return {user: toPublic(user!), jwt};
}


