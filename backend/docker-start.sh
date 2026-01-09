#!/bin/bash

# Docker Compose Helper Script

case "$1" in
  "up")
    echo "🚀 Starting containers..."
    docker compose up --build -d
    echo "✅ Containers started!"
    docker compose logs -f
    ;;
  "down")
    echo "🛑 Stopping containers..."
    docker compose down
    echo "✅ Containers stopped!"
    ;;
  "restart")
    echo "🔄 Restarting containers..."
    docker compose restart
    echo "✅ Containers restarted!"
    ;;
  "rebuild")
    echo "🔨 Rebuilding containers..."
    docker compose up --build --force-recreate -d
    echo "✅ Containers rebuilt!"
    ;;
  "logs")
    echo "📋 Showing logs..."
    docker compose logs -f
    ;;
  "clean")
    echo "🧹 Cleaning up (removing volumes)..."
    docker compose down -v
    echo "✅ Cleanup complete!"
    ;;
  *)
    echo "Docker Compose Helper"
    echo "Usage: ./docker-start.sh [command]"
    echo ""
    echo "Commands:"
    echo "  up       - Start containers with build"
    echo "  down     - Stop containers"
    echo "  restart  - Restart containers"
    echo "  rebuild  - Force rebuild all containers"
    echo "  logs     - Show container logs"
    echo "  clean    - Remove containers and volumes"
    ;;
esac
