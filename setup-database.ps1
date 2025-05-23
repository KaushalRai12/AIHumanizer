# Database configuration
$DBName = "ai_humanizer"
$Username = "postgres" 
$Password = "Testers"
$DBHost = "localhost"
$Port = "5432"

Write-Host "Setting up PostgreSQL database for AI Humanizer..." -ForegroundColor Green

# Create temporary SQL file for database creation
$TempSQLFile = Join-Path $PSScriptRoot "temp_setup.sql"
@"
-- Drop database if exists (comment this out if you don't want to risk data loss)
DROP DATABASE IF EXISTS $DBName;

-- Create the database
CREATE DATABASE $DBName;
"@ | Out-File -FilePath $TempSQLFile -Encoding utf8

# Determine if pgAdmin is installed and find psql location
$PgAdminPath = ""
$PsqlPath = ""

# Common pgAdmin installation paths
$PossiblePaths = @(
    "C:\Program Files\PostgreSQL",
    "C:\Program Files (x86)\PostgreSQL",
    "C:\Program Files\pgAdmin 4\v*\runtime"
)

foreach ($BasePath in $PossiblePaths) {
    $Paths = Get-ChildItem -Path $BasePath -ErrorAction SilentlyContinue
    
    foreach ($Path in $Paths) {
        $PsqlCandidate = Join-Path $Path.FullName "bin\psql.exe"
        if (Test-Path $PsqlCandidate) {
            $PsqlPath = $PsqlCandidate
            Write-Host "Found psql at: $PsqlPath" -ForegroundColor Green
            break
        }
    }
    
    if ($PsqlPath) { break }
}

if (-not $PsqlPath) {
    Write-Host "Could not find psql.exe. Please install PostgreSQL or add it to your PATH." -ForegroundColor Red
    exit 1
}

# Execute SQL commands with PGPASSWORD environment variable
try {
    $env:PGPASSWORD = $Password
    
    # Create database
    Write-Host "Creating database..." -ForegroundColor Yellow
    & $PsqlPath -U $Username -h $DBHost -f $TempSQLFile
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create database. Make sure PostgreSQL is running and credentials are correct."
    }
    
    # Run schema SQL
    Write-Host "Creating tables..." -ForegroundColor Yellow
    $DatabaseSQL = Join-Path $PSScriptRoot "database.sql"
    & $PsqlPath -U $Username -h $DBHost -d $DBName -f $DatabaseSQL
    
    if ($LASTEXITCODE -ne 0) {
        throw "Failed to create tables."
    }

    Write-Host "Database setup completed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "Make sure PostgreSQL is running and the credentials are correct." -ForegroundColor Yellow
}
finally {
    # Clean up
    Remove-Item -Path $TempSQLFile -ErrorAction SilentlyContinue
    # Reset PGPASSWORD
    $env:PGPASSWORD = ""
}

Write-Host "Database setup script completed" -ForegroundColor Green 