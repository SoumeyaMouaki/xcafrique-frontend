# Script PowerShell pour créer le fichier .env
# Exécutez ce script avec: .\create-env.ps1

$envContent = @"
# Configuration API Backend
# En développement, le proxy Vite est utilisé (voir vite.config.js)
# En production, utilisez l'URL de votre API déployée

# URL de base de l'API (sans /api à la fin)
# Développement local - utilisez localhost pour le dev
VITE_API_URL=http://localhost:5000

# Production (backend déployé sur Vercel)
# Décommentez cette ligne pour la production :
# VITE_API_URL=https://xcafrique-backend.vercel.app

# URL du site (pour les liens et partage social)
VITE_SITE_URL=https://xcafrique.org
"@

Set-Content -Path ".env" -Value $envContent -Encoding UTF8

Write-Host "✅ Fichier .env créé avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "Contenu du fichier .env:" -ForegroundColor Yellow
Write-Host $envContent
Write-Host ""
Write-Host "⚠️  IMPORTANT: Redémarrez le serveur de développement (npm run dev) pour que les changements prennent effet." -ForegroundColor Cyan

