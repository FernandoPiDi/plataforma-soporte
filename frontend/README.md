# Frontend - Sistema de Tickets de Soporte

## 🚀 Inicialización del Frontend

### Requisitos Previos
- Node.js 18+
- pnpm (recomendado)

### 1. Instalación de Dependencias

```bash
cd frontend
pnpm install
```

### 2. Configuración de Variables de Entorno

El archivo `.env.local` NO existe en el repositorio. Debes crearlo manualmente. Con Docker, este archivo NO es necesario (variables en `docker-compose.yml`)

Crea un archivo `.env.local` en la carpeta `frontend/`:

```bash
cd frontend
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:3000
EOF
```

O créalo manualmente con tu editor preferido:

```env
# URL del Backend API
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Iniciar el Servidor de Desarrollo

```bash
pnpm run dev
```

El frontend estará disponible en: **http://localhost:3001**

### 4. Build para Producción

```bash
# Generar build optimizado
pnpm run build

# Iniciar en modo producción
pnpm run start
```

---

## 🎨 Stack Tecnológico

### Core
- **Next.js 15** - Framework de React con App Router
- **React 19** - Librería de UI
- **TypeScript** - Tipado estático

### Styling
- **Tailwind CSS v4** - Framework de CSS utility-first
- **shadcn/ui** - Componentes de UI pre-diseñados
- **Lucide React** - Iconos modernos

### Gráficos y Visualización
- **Recharts 2.15** - Librería de gráficos para reportes
  - Pie Chart (distribución por estado)
  - Bar Chart (top clientes)
  - Line Chart (tendencias temporales)

### Gestión de Estado
- **React Context API** - Para autenticación y tema
- **localStorage** - Almacenamiento de token JWT y preferencias

### Características Implementadas

#### 🔐 Autenticación
- JWT Token-based authentication
- Almacenamiento seguro en localStorage
- Context API para gestión global del usuario
- Protección de rutas por rol

#### 🌓 Dark Mode
- Toggle manual entre tema claro y oscuro
- Detección automática de preferencias del sistema
- Persistencia de preferencia en localStorage
- Animaciones suaves de transición

#### 📊 Dashboards por Rol
- **Cliente Dashboard**: Crear y ver tickets propios
- **Soporte Dashboard**: Asignar, responder y gestionar tickets
- **Admin Dashboard**: Vista global, gestión de usuarios y reportes gráficos

#### 🤖 Sugerencias con IA
- Componente `AISuggestions` para respuestas automáticas
- Integración con backend OpenAI
- UI intuitiva con selección de sugerencias
- Solo visible para Soporte y Administradores

#### 📈 Reportes Gráficos (Admin)
- Distribución de tickets por estado (Pie Chart)
- Top 10 clientes con más tickets (Bar Chart)
- Tendencia de tickets en el tiempo (Line Chart)

---

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── dashboard/          # Rutas del dashboard
│   │   │   ├── layout.tsx      # Layout con navegación
│   │   │   ├── page.tsx        # Dashboard principal
│   │   │   ├── tickets/        # Gestión de tickets
│   │   │   └── users/          # Gestión de usuarios (Admin)
│   │   ├── login/              # Página de login
│   │   ├── register/           # Página de registro
│   │   ├── layout.tsx          # Layout raíz
│   │   ├── page.tsx            # Página de inicio
│   │   └── globals.css         # Estilos globales
│   │
│   ├── components/             # Componentes React
│   │   ├── ui/                 # Componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── theme-toggle.tsx # Toggle de dark mode
│   │   │   └── ...
│   │   ├── dashboards/         # Dashboards por rol
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── SoporteDashboard.tsx
│   │   │   └── ClienteDashboard.tsx
│   │   ├── tickets/            # Componentes de tickets
│   │   │   ├── TicketCard.tsx
│   │   │   ├── TicketStatusBadge.tsx
│   │   │   └── AISuggestions.tsx
│   │   ├── charts/             # Gráficos (Recharts)
│   │   │   ├── TicketsByStatusChart.tsx
│   │   │   ├── TicketsByClientChart.tsx
│   │   │   └── TicketsTimelineChart.tsx
│   │   └── theme-script.tsx    # Script para prevenir flash
│   │
│   ├── contexts/               # React Context
│   │   ├── AuthContext.tsx     # Autenticación global
│   │   └── ThemeContext.tsx    # Gestión de tema
│   │
│   └── lib/                    # Utilidades
│       ├── api.ts              # Cliente HTTP para backend
│       └── utils.ts            # Helpers generales
│
├── public/                     # Archivos estáticos
├── components.json             # Configuración shadcn/ui
├── next.config.ts              # Configuración Next.js
├── tailwind.config.ts          # Configuración Tailwind
├── tsconfig.json               # Configuración TypeScript
├── Dockerfile                  # Imagen Docker
└── package.json                # Dependencias
```

---

## 🔧 Scripts Disponibles

```bash
# Desarrollo con hot reload
pnpm run dev

# Build de producción
pnpm run build

# Iniciar en producción
pnpm run start

# Linting
pnpm run lint
pnpm run lint:fix

# Type checking
pnpm run typecheck
```

---

## 🐳 Docker

### Dockerfile del Frontend

El `Dockerfile` incluido configura:
- Node.js 20 Alpine
- Instalación de dependencias con pnpm
- Hot reload habilitado en desarrollo
- Optimización para producción

### Variables de Entorno en Docker

En `docker-compose.yml`:

```yaml
frontend:
  environment:
    NEXT_PUBLIC_API_URL: http://localhost:3000
```

---

## 🧪 Testing

### Testing Manual

1. **Autenticación**:
   - Registrar nuevo usuario
   - Login/Logout
   - Persistencia de sesión

2. **Roles**:
   - Dashboard de Cliente
   - Dashboard de Soporte
   - Dashboard de Admin

3. **Tickets**:
   - Crear ticket
   - Ver lista
   - Ver detalles
   - Agregar respuestas

4. **Gráficos (Admin)**:
   - Ver distribución por estado
   - Ver top clientes
   - Ver tendencias


