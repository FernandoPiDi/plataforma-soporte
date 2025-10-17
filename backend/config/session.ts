import connectPgSimple from "connect-pg-simple";
import session from "express-session";

import pool from "./db.js";

const PgSession = connectPgSimple(session);

export const sessionConfig: session.SessionOptions = {
  cookie: {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET ?? "your-secret-key-change-in-production",
  store: new PgSession({
    createTableIfMissing: true,
    pool: pool,
    tableName: "session",
  }),
};
