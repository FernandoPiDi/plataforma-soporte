# Sistema de Tickets de Soporte

Sistema completo de gestión de tickets de soporte con autenticación JWT, control de acceso por roles, sugerencias con IA, notificaciones por email y reportes gráficos.

---

## 🚀 Inicialización Rápida

### Opción 1: Docker (Recomendado - 2 minutos) 🐳

La forma más rápida de ejecutar todo el proyecto:

```bash
# 1. Asegúrate de tener Docker Desktop instalado y corriendo

# 2. Clona el repositorio
git clone git@github.com:FernandoPiDi/plataforma-soporte.git
cd cifra-test

# 3. (Opcional) Configura tu OpenAI API Key para sugerencias con IA
# Crea un archivo .env en la raíz:
echo "OPENAI_API_KEY=sk-tu-key-aqui" > .env

# 4. Inicia todo con un solo comando
docker-compose up

# 5. ¡Listo! Accede a:
# - Frontend: http://localhost:3001
# - Backend API: http://localhost:3000
# - Swagger Docs: http://localhost:3000/api-docs
# - MailHog (Emails): http://localhost:8025
```

#### Credenciales de Prueba

```
Admin:
  Email: admin@example.com
  Contraseña: admin123

Soporte:
  Email: soporte@example.com
  Contraseña: soporte123

Cliente:
  Email: cliente@example.com
  Contraseña: cliente123
```

#### Comandos Docker Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Detener servicios
docker-compose down

# Detener y limpiar todo (incluye base de datos)
docker-compose down -v

# Reconstruir imágenes
docker-compose up --build
```

---

### Opción 2: Instalación Manual (5 minutos) 📦

Si prefieres ejecutar sin Docker:

#### 1. Base de Datos PostgreSQL

```bash
# Crear base de datos
createdb support_tickets

# Ejecutar schema
psql -d support_tickets -f backend/db/schema.sql
```

#### 2. Backend

```bash
cd backend

# Instalar dependencias
pnpm install

# ⚠️ IMPORTANTE: El archivo .env NO existe, créalo ahora
# Crear archivo .env
cat > .env << 'EOF'
PORT=3000
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=support_tickets

# JWT
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Frontend
FRONTEND_URL=http://localhost:3001

# OpenAI (opcional - para sugerencias con IA)
OPENAI_API_KEY=sk-tu-key-aqui

# Email (opcional - para notificaciones)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_FROM=noreply@support-tickets.local
EOF

# Poblar con datos de prueba
pnpm run seed

# Iniciar servidor
pnpm run dev
```

Backend disponible en: **http://localhost:3000**

#### 3. Frontend (en otra terminal)

```bash
cd frontend

# Instalar dependencias
pnpm install

# ⚠️ IMPORTANTE: El archivo .env.local NO existe, créalo ahora
# Crear archivo .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local

# Iniciar aplicación
pnpm run dev
```

Frontend disponible en: **http://localhost:3001**

---

## 📋 Variables de Entorno

### Variables en la Raíz del Proyecto (para Docker)

**⚠️ NOTA**: Con Docker, normalmente NO necesitas crear archivos `.env` porque las variables están en `docker-compose.yml`.

**OPCIONAL**: Si quieres personalizar la `OPENAI_API_KEY`, puedes crear un archivo `.env` en la raíz:

```bash
# Crear archivo .env en la raíz (OPCIONAL)
echo "OPENAI_API_KEY=sk-tu-key-aqui" > .env
```

Este archivo será leído automáticamente por Docker Compose.

#

## 🏗️ Stack Tecnológico

### Backend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Runtime de JavaScript |
| **TypeScript** | 5.x | Tipado estático |
| **Express.js** | 5.x | Framework web |
| **PostgreSQL** | 15+ | Base de datos relacional |
| **JWT** | - | Autenticación basada en tokens |
| **bcrypt** | 6.x | Hash de contraseñas |
| **LangChain** | 0.3.x | Framework para IA |
| **OpenAI** | GPT-4o-mini | Sugerencias inteligentes |
| **nodemailer** | 6.x | Envío de emails |
| **Swagger/OpenAPI** | - | Documentación de API |

**Características Backend**:
- ✅ API RESTful con Express
- ✅ Autenticación JWT
- ✅ Control de acceso por roles (Admin, Soporte, Cliente)
- ✅ Sugerencias de respuestas con IA (OpenAI + LangChain)
- ✅ Notificaciones automáticas por email
- ✅ Reportes y estadísticas
- ✅ Documentación interactiva (Swagger)
- ✅ TypeScript estricto
- ✅ ESLint + Prettier

### Frontend

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 15.x | Framework de React |
| **React** | 19.x | Librería de UI |
| **TypeScript** | 5.x | Tipado estático |
| **Tailwind CSS** | 4.x | Framework de CSS |
| **shadcn/ui** | - | Componentes pre-diseñados |
| **Recharts** | 2.15.x | Gráficos y visualizaciones |
| **Lucide React** | - | Iconos modernos |

**Características Frontend**:
- ✅ Next.js 15 con App Router
- ✅ React 19
- ✅ Dashboards por rol (Cliente, Soporte, Admin)
- ✅ Dark mode con persistencia
- ✅ Componentes shadcn/ui
- ✅ Gráficos interactivos (Recharts)
- ✅ Responsive design
- ✅ TypeScript estricto

### Infraestructura

| Tecnología | Propósito |
|------------|-----------|
| **Docker** | Containerización |
| **Docker Compose** | Orquestación de servicios |
| **MailHog** | Testing de emails en desarrollo |

---

## 📁 Estructura del Proyecto

```
cifra-test/
├── backend/                    # Backend API
│   ├── config/                 # Configuraciones (DB, Swagger)
│   ├── controllers/            # Controladores HTTP
│   ├── db/                     # Schema y seed
│   ├── middleware/             # Auth middleware
│   ├── routes/                 # Definición de rutas
│   ├── services/               # Lógica de negocio
│   ├── types/                  # TypeScript types
│   ├── server.ts               # Punto de entrada
│   ├── Dockerfile              # Imagen Docker
│   ├── package.json
│   └── README.md               # Documentación del backend
│
├── frontend/                   # Frontend Next.js
│   ├── src/
│   │   ├── app/                # Pages (App Router)
│   │   │   ├── dashboard/      # Dashboard protegido
│   │   │   ├── login/          # Página de login
│   │   │   └── register/       # Página de registro
│   │   ├── components/         # Componentes React
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── dashboards/     # Dashboards por rol
│   │   │   ├── tickets/        # Componentes de tickets
│   │   │   └── charts/         # Gráficos (Recharts)
│   │   ├── contexts/           # React Context (Auth, Theme)
│   │   └── lib/                # API client y utilidades
│   ├── Dockerfile              # Imagen Docker
│   ├── package.json
│   └── README.md               # Documentación del frontend
│
├── docker-compose.yml          # Orquestación de servicios
├── start-docker.sh             # Script de inicio rápido
├── stop-docker.sh              # Script para detener
└── README.md                   # Este archivo
```

---

## 🐳 Despliegue con Docker

### Arquitectura Docker

El `docker-compose.yml` incluye 4 servicios:

1. **postgres**: Base de datos PostgreSQL 15
   - Puerto: 5432
   - Inicialización automática del schema
   - Volumen persistente

2. **backend**: API Node.js
   - Puerto: 3000
   - Hot reload habilitado
   - Seed automático al iniciar

3. **frontend**: Next.js
   - Puerto: 3001
   - Hot reload habilitado
   - Conectado al backend

4. **mailhog**: Testing de emails
   - SMTP: Puerto 1025
   - Web UI: Puerto 8025

### Comandos Docker

```bash
# Iniciar todos los servicios
docker-compose up

# Iniciar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f

# Reiniciar un servicio
docker-compose restart backend

# Detener todo
docker-compose down

# Detener y limpiar volúmenes (resetear DB)
docker-compose down -v

# Reconstruir imágenes
docker-compose up --build
```

### Acceder a los Servicios

Una vez iniciado con Docker:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:3001 | Aplicación web |
| Backend | http://localhost:3000 | API REST |
| Swagger | http://localhost:3000/api-docs | Documentación API |
| MailHog | http://localhost:8025 | Interfaz de emails |
| PostgreSQL | localhost:5432 | Base de datos |

---

### Flujo de Prueba Completo

1. **Como Cliente**:
   - Login con `cliente@example.com`
   - Crear un nuevo ticket
   - Ver lista de tickets propio

2. **Como Soporte**:
   - Login con `soporte@example.com`
   - Ver todos los tickets sin asignar
   - Asignar un ticket a ti mismo
   - Generar sugerencias con IA
   - Cambiar estado del ticket
   - Responder al ticket

3. **Como Admin**:
   - Login con `admin@example.com`
   - Ver todos los tickets (vista global)
   - Ver reportes gráficos en el dashboard
   - Ir a "Usuarios" y cambiar roles
   - Gestionar cualquier ticket

4. **Verificar Emails**:
   - Abrir http://localhost:8025 (MailHog)
   - Realizar acciones (crear ticket, asignar, responder)
   - Ver emails recibidos en tiempo real

### Scripts de Desarrollo

#### Backend

```bash
cd backend

pnpm run dev          # Desarrollo con hot reload
pnpm run seed         # Re-ejecutar seed
pnpm run typecheck    # Verificar tipos TypeScript
pnpm run lint         # Ejecutar linter
pnpm run lint:fix     # Corregir errores de lint
pnpm run format       # Formatear código
```

#### Frontend

```bash
cd frontend

pnpm run dev          # Desarrollo con hot reload
pnpm run build        # Build de producción
pnpm run start        # Iniciar en producción
pnpm run typecheck    # Verificar tipos TypeScript
pnpm run lint         # Ejecutar linter
```

---

