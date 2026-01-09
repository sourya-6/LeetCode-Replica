#!/usr/bin/env pwsh

# Docker Compose Helper Script (PowerShell)

param(
    [Parameter(Position = 0)]
    [ValidateSet("up", "down", "restart", "rebuild", "logs", "clean", "status")]
    [string]$Command = "help"
)

switch ($Command) {
    "up" {
        Write-Host "🚀 Starting containers..." -ForegroundColor Green
        docker compose up --build -d
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Containers started!" -ForegroundColor Green
            docker compose logs -f
        }
    }
    "down" {
        Write-Host "🛑 Stopping containers..." -ForegroundColor Yellow
        docker compose down
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Containers stopped!" -ForegroundColor Green
        }
    }
    "restart" {
        Write-Host "🔄 Restarting containers..." -ForegroundColor Cyan
        docker compose restart
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Containers restarted!" -ForegroundColor Green
        }
    }
    "rebuild" {
        Write-Host "🔨 Rebuilding containers..." -ForegroundColor Cyan
        docker compose up --build --force-recreate -d
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Containers rebuilt!" -ForegroundColor Green
        }
    }
    "logs" {
        Write-Host "📋 Showing logs..." -ForegroundColor Cyan
        docker compose logs -f
    }
    "status" {
        Write-Host "📊 Container status..." -ForegroundColor Cyan
        docker compose ps
    }
    "clean" {
        Write-Host "🧹 Cleaning up (removing volumes)..." -ForegroundColor Yellow
        docker compose down -v
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Cleanup complete!" -ForegroundColor Green
        }
    }
    default {
        Write-Host "Docker Compose Helper" -ForegroundColor Cyan
        Write-Host "Usage: .\docker-start.ps1 [command]`n" -ForegroundColor Cyan
        Write-Host "Commands:" -ForegroundColor Green
        Write-Host "  up       - Start containers with build"
        Write-Host "  down     - Stop containers"
        Write-Host "  restart  - Restart containers"
        Write-Host "  rebuild  - Force rebuild all containers"
        Write-Host "  logs     - Show container logs"
        Write-Host "  status   - Show container status"
        Write-Host "  clean    - Remove containers and volumes"
    }
}
