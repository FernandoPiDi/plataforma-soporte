const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface FetchOptions extends RequestInit {
  body?: any;
}

// Helper function to get the JWT token from localStorage
function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

// Helper function to set the JWT token in localStorage
export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

// Helper function to remove the JWT token from localStorage
export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

export async function api(endpoint: string, options: FetchOptions = {}) {
  const token = getAuthToken();
  
  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Algo salió mal");
  }

  return data;
}

// Auth API
export const authAPI = {
  register: (nombre: string, email: string, password: string) =>
    api("/api/auth/register", {
      method: "POST",
      body: { nombre, email, password },
    }),

  login: (email: string, password: string) =>
    api("/api/auth/login", {
      method: "POST",
      body: { email, password },
    }),

  logout: () =>
    api("/api/auth/logout", {
      method: "POST",
    }),

  me: () => api("/api/auth/me"),
};

// User API
export const userAPI = {
  getAll: () => api("/api/users"),
  updateRole: (userId: number, rol_id: number) =>
    api(`/api/users/${userId}/role`, {
      method: "PATCH",
      body: { rol_id },
    }),
  getRoles: () => api("/api/users/roles"),
};

// Ticket API
export const ticketAPI = {
  create: (titulo: string, descripcion: string) =>
    api("/api/tickets", {
      method: "POST",
      body: { titulo, descripcion },
    }),

  getAll: () => api("/api/tickets"),

  getById: (id: number) => api(`/api/tickets/${id}`),

  assign: (id: number) =>
    api(`/api/tickets/${id}/assign`, {
      method: "PATCH",
    }),

  updateStatus: (id: number, estado: string) =>
    api(`/api/tickets/${id}/status`, {
      method: "PATCH",
      body: { estado },
    }),

  getStats: () => api("/api/tickets/stats"),
};

// Response API
export const responseAPI = {
  create: (ticketId: number, respuesta: string) =>
    api(`/api/tickets/${ticketId}/responses`, {
      method: "POST",
      body: { respuesta },
    }),

  getByTicketId: (ticketId: number) =>
    api(`/api/tickets/${ticketId}/responses`),
};

// AI API
export const aiAPI = {
  getSuggestions: (ticketId: number) =>
    api(`/api/tickets/${ticketId}/ai-suggestions`),
};

