import { cookies } from "next/headers";

const SESSION_COOKIE = "asdarium_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "dev-secret-change-me";
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD ?? "asdarium2026";
}

async function signToken(): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const payload = `admin:${Date.now()}`;
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const sigHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${payload}.${sigHex}`;
}

async function verifyToken(token: string): Promise<boolean> {
  const [payload, sigHex] = token.split(".");
  if (!payload || !sigHex || !payload.startsWith("admin:")) return false;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  const expected = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return expected === sigHex;
}

export async function createAdminSession(): Promise<void> {
  const token = await signToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifyToken(token);
}

export function validateAdminPassword(password: string): boolean {
  return password === getAdminPassword();
}