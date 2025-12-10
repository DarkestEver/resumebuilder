# ProfileBuilder - Create Production Package
# Usage: .\scripts\create-production.ps1

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Creating Production Package" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set paths - use current directory
$rootDir = (Get-Location).Path
$prodDir = "$rootDir\production"

Write-Host "Root: $rootDir"
Write-Host "Prod: $prodDir"
Write-Host ""

# Check if builds exist
Write-Host "Checking builds..." -ForegroundColor Yellow

if (-not (Test-Path "$rootDir\backend\dist")) {
    Write-Host "ERROR: backend/dist not found! Run 'npm run build' first" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "$rootDir\frontend\.next")) {
    Write-Host "ERROR: frontend/.next not found! Run 'npm run build' first" -ForegroundColor Red
    exit 1
}

Write-Host "OK - Builds found" -ForegroundColor Green

# Remove old production folder
if (Test-Path $prodDir) {
    Write-Host "Removing old production folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $prodDir
}

# Create production folder structure
Write-Host "Creating production folder..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $prodDir | Out-Null
New-Item -ItemType Directory -Force -Path "$prodDir\backend" | Out-Null
New-Item -ItemType Directory -Force -Path "$prodDir\frontend" | Out-Null
New-Item -ItemType Directory -Force -Path "$prodDir\scripts" | Out-Null

# Copy root files
Write-Host "Copying configuration files..." -ForegroundColor Yellow
Copy-Item "$rootDir\.env.production" "$prodDir\"
Copy-Item "$rootDir\docker-compose.prebuilt.yml" "$prodDir\"

# Copy scripts
Write-Host "Copying scripts..." -ForegroundColor Yellow
Copy-Item "$rootDir\scripts\deploy-prebuilt.sh" "$prodDir\scripts\"
Copy-Item "$rootDir\scripts\seed-database.js" "$prodDir\scripts\"

# Copy backend
Write-Host "Copying backend (dist + node_modules)... This may take a moment" -ForegroundColor Yellow
Copy-Item -Recurse "$rootDir\backend\dist" "$prodDir\backend\"
Copy-Item -Recurse "$rootDir\backend\node_modules" "$prodDir\backend\"
Copy-Item "$rootDir\backend\package.json" "$prodDir\backend\"

# Create uploads folder
New-Item -ItemType Directory -Force -Path "$prodDir\backend\uploads" | Out-Null

# Copy frontend
Write-Host "Copying frontend (.next + node_modules)... This may take a moment" -ForegroundColor Yellow
Copy-Item -Recurse "$rootDir\frontend\.next" "$prodDir\frontend\"
Copy-Item -Recurse "$rootDir\frontend\node_modules" "$prodDir\frontend\"
if (Test-Path "$rootDir\frontend\public") {
    Copy-Item -Recurse "$rootDir\frontend\public" "$prodDir\frontend\"
}
Copy-Item "$rootDir\frontend\package.json" "$prodDir\frontend\"
Copy-Item "$rootDir\frontend\next.config.js" "$prodDir\frontend\"

# Calculate size
$size = (Get-ChildItem -Recurse $prodDir | Measure-Object -Property Length -Sum).Sum / 1MB
$sizeFormatted = [math]::Round($size, 2)

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Production package created!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Location: production\" -ForegroundColor White
Write-Host "Size: $sizeFormatted MB" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Edit production\.env.production (add GEMINI_API_KEY)"
Write-Host "  2. Upload 'production' folder to VPS"
Write-Host "  3. On VPS run:"
Write-Host "     chmod +x scripts/deploy-prebuilt.sh"
Write-Host "     ./scripts/deploy-prebuilt.sh"
Write-Host ""
