# Arquitectura del Sistema de Tickets de Soporte

## Diagrama de Arquitectura

```mermaid
graph TB
    subgraph "Cliente (Navegador)"
        A[Next.js Frontend<br/>React 19 + TypeScript<br/>Puerto 3001]
    end

    subgraph "Servidor Backend"
        B[Express API<br/>Node.js + TypeScript<br/>Puerto 3000]
        C[Auth Middleware<br/>Session Validation]
        D[Controllers<br/>Auth, Tickets, Users, AI]
        E[Services<br/>Business Logic]
        F[Email Service<br/>Nodemailer]
        G[AI Service<br/>LangChain + OpenAI]
    end

    subgraph "Almacenamiento"
        H[(PostgreSQL<br/>Base de Datos<br/>Puerto 5432)]
        I[Session Store<br/>connect-pg-simple]
    end

    subgraph "Servicios Externos"
        J[MailHog<br/>SMTP Testing<br/>Puerto 8025]
        K[OpenAI API<br/>GPT-4o-mini]
    end

    A -->|HTTP/JSON API| B
    B --> C
    C --> D
    D --> E
    E --> H
    E --> F
    E --> G
    B --> I
    I --> H
    F -->|SMTP| J
    G -->|API Key| K

    style A fill:#3b82f6,stroke:#1e40af,color:#fff
    style B fill:#8b5cf6,stroke:#6d28d9,color:#fff
    style H fill:#10b981,stroke:#059669,color:#fff
    style J fill:#f59e0b,stroke:#d97706,color:#fff
    style K fill:#ec4899,stroke:#db2777,color:#fff
```

## Flujo de Autenticación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as API Backend
    participant DB as PostgreSQL
    participant S as Session Store

    U->>F: Login (email, password)
    F->>A: POST /api/auth/login
    A->>DB: Verificar credenciales
    DB-->>A: Usuario válido
    A->>S: Crear sesión
    S-->>A: Session ID
    A-->>F: Set-Cookie (sessionId)
    F-->>U: Redirigir a Dashboard
```

## Flujo de Creación de Ticket

```mermaid
sequenceDiagram
    participant C as Cliente
    participant F as Frontend
    participant A as API Backend
    participant DB as PostgreSQL
    participant E as Email Service
    participant M as MailHog

    C->>F: Crear ticket
    F->>A: POST /api/tickets
    A->>DB: INSERT solicitud
    DB-->>A: Ticket creado
    A->>E: Notificar creación
    E->>M: Enviar email a Soporte/Admin
    A-->>F: Ticket creado (JSON)
    F-->>C: Mostrar confirmación
```

## Flujo de Sugerencias con IA

```mermaid
sequenceDiagram
    participant S as Soporte/Admin
    participant F as Frontend
    participant A as API Backend
    participant AI as AI Service
    participant O as OpenAI API

    S->>F: Click "Generar Respuestas IA"
    F->>A: GET /api/tickets/:id/ai-suggestions
    A->>AI: generateSuggestions(ticket)
    AI->>O: Prompt con contexto del ticket
    O-->>AI: 3 respuestas generadas
    AI-->>A: Sugerencias formateadas
    A-->>F: JSON con sugerencias
    F-->>S: Mostrar 3 sugerencias
    S->>F: Click en sugerencia
    F->>F: Insertar en textarea
```

## Stack Tecnológico por Capa

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Charts**: Recharts
- **State**: React Context API
- **HTTP Client**: Fetch API con credentials

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Session**: express-session + connect-pg-simple
- **Security**: bcrypt, helmet, cors
- **Email**: nodemailer
- **AI**: LangChain + OpenAI SDK
- **Documentation**: Swagger (swagger-ui-express)

### Database
- **DBMS**: PostgreSQL 12+
- **ORM**: Raw SQL con pg Pool
- **Schema**: 4 tablas principales
  - roles
  - usuarios
  - solicitudes
  - respuestas

### DevOps
- **Containerization**: Docker + Docker Compose
- **Services**: 4 contenedores
  - frontend (Next.js)
  - backend (Express)
  - postgres (PostgreSQL)
  - mailhog (Email testing)

