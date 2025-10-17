-- Elimina tablas si existen para empezar desde cero
DROP TABLE IF EXISTS respuestas;
DROP TABLE IF EXISTS solicitudes;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS roles;

-- Tabla de Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Tabla de Usuarios
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol_id INTEGER REFERENCES roles(id) NOT NULL
);

-- Tabla de Solicitudes
CREATE TABLE solicitudes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'abierta',
    creada_por_id INTEGER REFERENCES usuarios(id) NOT NULL,
    asignada_a_id INTEGER REFERENCES usuarios(id), -- Nullable, puede no estar asignada
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Respuestas (para el hilo de la conversación)
CREATE TABLE respuestas (
    id SERIAL PRIMARY KEY,
    solicitud_id INTEGER REFERENCES solicitudes(id) NOT NULL,
    respuesta TEXT NOT NULL,
    creada_por_id INTEGER REFERENCES usuarios(id) NOT NULL,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
