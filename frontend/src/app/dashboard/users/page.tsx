"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { userAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  nombre: string;
  email: string;
  rol_id: number;
  rol_nombre: string;
}

interface Role {
  id: number;
  nombre: string;
}

export default function UsersManagementPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);

  useEffect(() => {
    if (currentUser?.rol_nombre !== "Administrador") {
      router.push("/dashboard");
      return;
    }

    loadData();
  }, [currentUser]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, rolesData] = await Promise.all([
        userAPI.getAll(),
        userAPI.getRoles(),
      ]);
      setUsers(usersData.users);
      setRoles(rolesData.roles);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRoleId: string) => {
    try {
      setUpdatingUserId(userId);
      await userAPI.updateRole(userId, parseInt(newRoleId));
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al actualizar rol");
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">Cargando usuarios...</div>
    );
  }

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case "Administrador":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      case "Soporte":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "Cliente":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <p className="text-gray-600 mt-1">
          Administra los roles de los usuarios del sistema
        </p>
      </div>

      {error && (
        <div className="p-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol Actual</TableHead>
                <TableHead>Cambiar Rol</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-sm">{user.id}</TableCell>
                  <TableCell className="font-medium">{user.nombre}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(user.rol_nombre)}>
                      {user.rol_nombre}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {currentUser?.id === user.id ? (
                      <span className="text-sm text-gray-500">No puedes cambiar tu propio rol</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Select
                          value={user.rol_id.toString()}
                          onValueChange={(value) => handleRoleChange(user.id, value)}
                          disabled={updatingUserId === user.id}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles.map((role) => (
                              <SelectItem key={role.id} value={role.id.toString()}>
                                {role.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {updatingUserId === user.id && (
                          <span className="text-sm text-gray-500">Actualizando...</span>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

