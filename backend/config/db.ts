import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({
  database: process.env.DB_DATABASE,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER,
});

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log("Conectado a la base de datos PostgreSQL");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
  }
};

export default pool;
