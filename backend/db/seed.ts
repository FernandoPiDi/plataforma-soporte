import bcrypt from "bcrypt";
import dotenv from "dotenv";

import pool from "../config/db.js";

dotenv.config();

async function seed() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");


    console.log("Seeding roles...");
    await client.query(`
      INSERT INTO roles (nombre) 
      VALUES ('Cliente'), ('Soporte'), ('Administrador')
      ON CONFLICT (nombre) DO NOTHING
      RETURNING id, nombre
    `);


    const roles = await client.query("SELECT id, nombre FROM roles");
    const adminRole = roles.rows.find((r) => r.nombre === "Administrador");
    const clienteRole = roles.rows.find((r) => r.nombre === "Cliente");
    const soporteRole = roles.rows.find((r) => r.nombre === "Soporte");

    console.log("Roles seeded:", roles.rows);


    console.log("Creating default admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await client.query(
      `
      INSERT INTO usuarios (nombre, email, contrasena, rol_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `,
      ["Admin User", "admin@example.com", hashedPassword, adminRole.id],
    );


    console.log("Creating sample users...");

    const clientePassword = await bcrypt.hash("cliente123", 10);
    await client.query(
      `
      INSERT INTO usuarios (nombre, email, contrasena, rol_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `,
      ["Cliente Demo", "cliente@example.com", clientePassword, clienteRole.id],
    );

    const soportePassword = await bcrypt.hash("soporte123", 10);
    await client.query(
      `
      INSERT INTO usuarios (nombre, email, contrasena, rol_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `,
      ["Soporte Demo", "soporte@example.com", soportePassword, soporteRole.id],
    );


    console.log("Creating sample tickets...");

    const clienteUser = await client.query(
      "SELECT id FROM usuarios WHERE email = $1",
      ["cliente@example.com"],
    );

    if (clienteUser.rows.length > 0) {
      const clienteId = clienteUser.rows[0].id;

      await client.query(
        `
        INSERT INTO solicitudes (titulo, descripcion, estado, creada_por_id)
        VALUES 
          ($1, $2, $3, $4),
          ($5, $6, $7, $8),
          ($9, $10, $11, $12)
        ON CONFLICT DO NOTHING
      `,
        [
          "Problema con el inicio de sesión",
          "No puedo acceder a mi cuenta, me dice que la contraseña es incorrecta pero estoy seguro de que es la correcta.",
          "abierta",
          clienteId,
          "Error al cargar dashboard",
          "Cuando intento abrir el dashboard, la página se queda en blanco y no carga nada.",
          "abierta",
          clienteId,
          "Consulta sobre funcionalidad",
          "¿Es posible exportar los datos de mis solicitudes a un archivo PDF o Excel?",
          "abierta",
          clienteId,
        ],
      );
    }

    await client.query("COMMIT");

    console.log("\n✅ Database seeded successfully!");
    console.log("\nDefault credentials:");
    console.log("Admin: admin@example.com / admin123");
    console.log("Cliente: cliente@example.com / cliente123");
    console.log("Soporte: soporte@example.com / soporte123");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed()
  .then(() => {
    console.log("Seed completed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
