"use client";

import { useAuth } from "@/contexts/AuthContext";
import ClienteDashboard from "@/components/dashboards/ClienteDashboard";
import SoporteDashboard from "@/components/dashboards/SoporteDashboard";
import AdminDashboard from "@/components/dashboards/AdminDashboard";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  if (user.rol_nombre === "Cliente") {
    return <ClienteDashboard />;
  }

  if (user.rol_nombre === "Soporte") {
    return <SoporteDashboard />;
  }

  if (user.rol_nombre === "Administrador") {
    return <AdminDashboard />;
  }

  return null;
}

