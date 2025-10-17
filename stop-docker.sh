#!/bin/bash

echo "🛑 Deteniendo Sistema de Tickets de Soporte..."
echo ""

# Check if services are running
if ! docker-compose ps | grep -q "Up"; then
    echo "ℹ️  Los servicios ya están detenidos"
    exit 0
fi

# Ask for confirmation if we should remove volumes
echo "¿Deseas eliminar los datos de la base de datos? (y/N)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "🗑️  Deteniendo servicios y eliminando volúmenes..."
    docker-compose down -v
    echo ""
    echo "✅ Servicios detenidos y datos eliminados"
else
    echo ""
    echo "🛑 Deteniendo servicios (datos preservados)..."
    docker-compose down
    echo ""
    echo "✅ Servicios detenidos"
    echo "ℹ️  Los datos de la base de datos se mantienen"
    echo "ℹ️  Para reiniciar: ./start-docker.sh o docker-compose up"
fi

echo ""

