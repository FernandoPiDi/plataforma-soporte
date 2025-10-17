#!/bin/bash

echo "🐳 Iniciando Sistema de Tickets de Soporte con Docker..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo"
    echo "Por favor, inicia Docker Desktop y vuelve a intentar"
    exit 1
fi

echo "✅ Docker está corriendo"
echo ""

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: docker-compose no está instalado"
    echo "Por favor, instala Docker Compose y vuelve a intentar"
    exit 1
fi

echo "✅ docker-compose está disponible"
echo ""

# Build and start services
echo "🚀 Construyendo e iniciando servicios..."
echo "   - PostgreSQL (puerto 5432)"
echo "   - Backend API (puerto 3000)"
echo "   - Frontend (puerto 3001)"
echo ""

docker-compose up --build -d

# Wait for services to be ready
echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ ¡Servicios iniciados correctamente!"
    echo ""
    echo "📍 URLs:"
    echo "   - Frontend: http://localhost:3001"
    echo "   - Backend API: http://localhost:3000"
    echo "   - PostgreSQL: localhost:5432"
    echo ""
    echo "🔑 Credenciales de prueba:"
    echo "   - Admin: admin@example.com / admin123"
    echo "   - Soporte: soporte@example.com / soporte123"
    echo "   - Cliente: cliente@example.com / cliente123"
    echo ""
    echo "📋 Comandos útiles:"
    echo "   - Ver logs: docker-compose logs -f"
    echo "   - Detener: docker-compose down"
    echo "   - Reiniciar: docker-compose restart"
    echo ""
    echo "🌐 Abriendo aplicación en el navegador..."
    
    # Try to open browser (works on macOS and Linux)
    if command -v open &> /dev/null; then
        open http://localhost:3001
    elif command -v xdg-open &> /dev/null; then
        xdg-open http://localhost:3001
    fi
else
    echo ""
    echo "⚠️  Algunos servicios pueden no estar listos aún"
    echo "Ver logs con: docker-compose logs -f"
fi

