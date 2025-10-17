"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="text-lg text-gray-900 dark:text-gray-100">Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Sistema de Tickets
              </Link>
              
              {/* Navigation based on role */}
              <div className="flex space-x-4">
                {user.rol_nombre === "Cliente" && (
                  <>
                    <Link
                      href="/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === "/dashboard"
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      Mis Tickets
                    </Link>
                  </>
                )}

                {user.rol_nombre === "Soporte" && (
                  <>
                    <Link
                      href="/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === "/dashboard"
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      Panel de Soporte
                    </Link>
                  </>
                )}

                {user.rol_nombre === "Administrador" && (
                  <>
                    <Link
                      href="/dashboard"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === "/dashboard"
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      Todos los Tickets
                    </Link>
                    <Link
                      href="/dashboard/users"
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        pathname === "/dashboard/users"
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                          : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      Usuarios
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <div className="text-sm">
                <div className="font-medium text-gray-900 dark:text-gray-100">{user.nombre}</div>
                <div className="text-gray-500 dark:text-gray-400 text-xs">{user.rol_nombre}</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

