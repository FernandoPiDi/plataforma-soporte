# Backend - Sistema de Tickets de Soporte

## 🚀 Inicialización del Backend

### Requisitos Previos
- Node.js 18+
- PostgreSQL 12+
- pnpm (recomendado) 

### 1. Configuración de la Base de Datos ()

Crea la base de datos PostgreSQL:

```bash
createdb support_tickets
```

Ejecuta el schema para crear las tablas:

```bash
psql -d support_tickets -f backend/db/schema.sql
```

### 2. Instalación de Dependencias

```bash
cd backend
pnpm install
```

### 3. Configuración de Variables de Entorno

El archivo `.env` NO existe en el repositorio. Debes crearlo manualmente. Con Docker, este archivo NO es necesario (variables en `docker-compose.yml`)

Crea un archivo `.env` en la carpeta `backend/`:

```env
# Servidor
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password_aqui
DB_DATABASE=support_tickets

# JWT Authentication
JWT_SECRET=cambia-este-secreto-en-produccion-usa-string-aleatorio-de-32-caracteres
JWT_EXPIRES_IN=7d

# OpenAI (para sugerencias con IA)
OPENAI_API_KEY=sk-tu-api-key-aqui

# Email (MailHog para desarrollo)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_FROM=noreply@support-tickets.local
```

### 4. Poblar la Base de Datos (Seed)

Crea usuarios y tickets de prueba:

```bash
pnpm run seed
```

Esto creará:
- **Admin**: admin@example.com / admin123
- **Soporte**: soporte@example.com / soporte123
- **Cliente**: cliente@example.com / cliente123

### 5. Iniciar el Servidor

```bash
pnpm run dev
```

El backend estará disponible en: **http://localhost:3000**


---

## 🛠️ Stack Tecnológico

### Core
- **Node.js** - Runtime de JavaScript
- **TypeScript** - Tipado estático
- **Express.js 5** - Framework web

### Base de Datos
- **PostgreSQL 15** - Base de datos relacional
- **pg (node-postgres)** - Driver de PostgreSQL para Node.js

### Autenticación y Seguridad
- **JWT (jsonwebtoken)** - Autenticación basada en tokens
- **bcrypt** - Hash de contraseñas
- **cors** - Control de Cross-Origin Resource Sharing

### Inteligencia Artificial
- **LangChain 0.3.36** - Framework para aplicaciones con LLMs
- **@langchain/openai** - Integración con OpenAI
- **OpenAI GPT-4o-mini** - Modelo de lenguaje para sugerencias

### Notificaciones
- **nodemailer** - Envío de correos electrónicos
- **MailHog** - Testing de emails en desarrollo

### Documentación
- **Swagger/OpenAPI** - Documentación interactiva de API
- **swagger-jsdoc** - Generación de docs desde JSDoc
- **swagger-ui-express** - UI de Swagger

### Desarrollo
- **nodemon** - Hot reload en desarrollo
- **ts-node** - Ejecución directa de TypeScript
- **ESLint** - Linting de código
- **Prettier** - Formateo de código

---

## 📁 Estructura del Proyecto

```
backend/
├── config/                     # Configuraciones
│   ├── db.ts                   # Pool de PostgreSQL
│   ├── session.ts              # Configuración de sesiones (legacy)
│   └── swagger.ts              # Configuración de Swagger
│
├── controllers/                # Controladores HTTP
│   ├── authController.ts       # Autenticación (login, register)
│   ├── userController.ts       # Gestión de usuarios
│   ├── ticketController.ts     # Gestión de tickets
│   ├── responseController.ts   # Respuestas a tickets
│   └── aiController.ts         # Sugerencias con IA
│
├── db/                         # Base de datos
│   ├── schema.sql              # Esquema de tablas
│   └── seed.ts                 # Datos de prueba
│
├── middleware/                 # Middlewares
│   └── auth.ts                 # Autenticación y autorización
│
├── routes/                     # Definición de rutas
│   ├── authRoutes.ts           # Rutas de autenticación
│   ├── userRoutes.ts           # Rutas de usuarios
│   ├── ticketRoutes.ts         # Rutas de tickets
│   ├── responseRoutes.ts       # Rutas de respuestas
│   └── aiRoutes.ts             # Rutas de IA
│
├── services/                   # Lógica de negocio
│   ├── authService.ts          # Servicio de autenticación
│   ├── userService.ts          # Servicio de usuarios
│   ├── ticketService.ts        # Servicio de tickets
│   ├── responseService.ts      # Servicio de respuestas
│   ├── aiService.ts            # Servicio de IA (LangChain)
│   └── emailService.ts         # Servicio de emails
│
├── types/                      # Definiciones TypeScript
│   └── index.ts                # Tipos globales
│
├── utils/                      # Utilidades
│
├── server.ts                   # Punto de entrada
├── tsconfig.json               # Configuración TypeScript
├── eslint.config.js            # Configuración ESLint
├── package.json                # Dependencias
├── Dockerfile                  # Imagen Docker
└── .env                        # Variables de entorno (no en Git)
```

---


### Endpoints de Autenticación

```bash
# Registrar usuario
POST /api/auth/register
Body: { "nombre": "Juan", "email": "juan@example.com", "password": "pass123" }

# Login
POST /api/auth/login
Body: { "email": "juan@example.com", "password": "pass123" }

# Obtener usuario actual
GET /api/auth/me
Header: Authorization: Bearer <token>

# Logout (client-side)
POST /api/auth/logout
```

---

## 📡 API Endpoints

### Autenticación (`/api/auth`)
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Usuarios (`/api/users`) - Admin only
- `GET /api/users` - Listar todos los usuarios
- `PATCH /api/users/:id/role` - Actualizar rol de usuario
- `GET /api/users/roles` - Listar roles disponibles

### Tickets (`/api/tickets`)
- `POST /api/tickets` - Crear nuevo ticket
- `GET /api/tickets` - Listar tickets (filtrado por rol)
- `GET /api/tickets/stats` - Estadísticas (Admin only)
- `GET /api/tickets/:id` - Obtener ticket por ID
- `PATCH /api/tickets/:id/assign` - Asignar ticket a sí mismo (Soporte)
- `PATCH /api/tickets/:id/status` - Actualizar estado del ticket

### Respuestas (`/api/tickets/:ticketId/responses`)
- `POST /api/tickets/:ticketId/responses` - Agregar respuesta
- `GET /api/tickets/:ticketId/responses` - Obtener respuestas

### IA (`/api/tickets/:ticketId/ai-suggestions`) - Soporte/Admin only
- `GET /api/tickets/:ticketId/ai-suggestions` - Obtener sugerencias con IA

