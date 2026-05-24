<#
.SYNOPSIS
    Deploys the EduMoni static SPA to GCP (Firebase Hosting or GCS).
.DESCRIPTION
    Builds the project and deploys it to the specified environment (feature or prd)
    using either Firebase Hosting or Google Cloud Storage.
.PARAMETER Environment
    The target deployment environment: 'feature' or 'prd'.
.PARAMETER Provider
    The deployment provider: 'firebase' (default) or 'gcs'.
.PARAMETER Channel
    (Optional) For Firebase provider, the hosting channel to deploy to (e.g., 'live' or a preview channel name).
    Defaults to 'live'.
.EXAMPLE
    .\deploy.ps1 -Environment feature
.EXAMPLE
    .\deploy.ps1 -Environment prd -Provider firebase
.EXAMPLE
    .\deploy.ps1 -Environment feature -Provider gcs
#>

param (
    [Parameter(Mandatory=$true)]
    [ValidateSet('feature', 'prd')]
    [string]$Environment,

    [Parameter(Mandatory=$false)]
    [ValidateSet('firebase', 'gcs')]
    [string]$Provider = 'firebase',

    [Parameter(Mandatory=$false)]
    [string]$Channel = 'live'
)

$ErrorActionPreference = "Stop"

Write-Host "=== Starting EduMoni Deploy Script ===" -ForegroundColor Cyan
Write-Host "Target Environment: $Environment" -ForegroundColor Yellow
Write-Host "Provider:           $Provider" -ForegroundColor Yellow
Write-Host "Channel/Target:     $Channel" -ForegroundColor Yellow
Write-Host ""

# 1. Build and Prepare Assets
Write-Host "Step 1: Installing dependencies and building assets..." -ForegroundColor Cyan
if (-not (Get-Command "npm" -ErrorAction SilentlyContinue)) {
    Write-Error "npm (Node.js) is not installed or not in PATH. Please install Node.js and try again."
}

Write-Host "Running: npm install" -ForegroundColor Gray
npm install

Write-Host "Running: npm run build" -ForegroundColor Gray
npm run build

if (-not (Test-Path "dist")) {
    Write-Error "Build directory 'dist' was not created. Build failed."
}
Write-Host "Build completed successfully." -ForegroundColor Green
Write-Host ""

# 2. Deploy
if ($Provider -eq 'firebase') {
    Write-Host "Step 2: Deploying to Firebase Hosting..." -ForegroundColor Cyan
    
    if (-not (Get-Command "firebase" -ErrorAction SilentlyContinue)) {
        Write-Error "Firebase CLI ('firebase') is not installed. Install it via 'npm install -g firebase-tools' and login using 'firebase login'."
    }

    Write-Host "Switching to Firebase project alias: $Environment" -ForegroundColor Gray
    firebase use $Environment

    if ($Channel -eq 'live') {
        Write-Host "Deploying to live channel..." -ForegroundColor Gray
        firebase deploy --only hosting
    } else {
        Write-Host "Deploying to preview channel '$Channel'..." -ForegroundColor Gray
        firebase hosting:channel:deploy $Channel
    }
}
elseif ($Provider -eq 'gcs') {
    Write-Host "Step 2: Deploying to Google Cloud Storage (GCS)..." -ForegroundColor Cyan
    
    if (-not (Get-Command "gcloud" -ErrorAction SilentlyContinue)) {
        Write-Error "Google Cloud SDK ('gcloud') is not installed or not in PATH. Please install it to deploy to GCS."
    }

    # Define bucket names based on environment
    $BucketName = if ($Environment -eq 'prd') { "edumoni-prd-bucket" } else { "edumoni-feature-bucket" }
    $BucketUri = "gs://$BucketName"

    Write-Host "Target Bucket: $BucketUri" -ForegroundColor Gray

    # Synchronize build directory 'dist' to bucket
    Write-Host "Synchronizing build directory 'dist' to $BucketUri..." -ForegroundColor Gray
    # Using gcloud storage rsync which is the modern replacement for gsutil rsync
    gcloud storage rsync dist $BucketUri --recursive --delete-unmatched

    # Set web access configuration (index.html as main page and error page for SPA)
    Write-Host "Setting GCS website configuration..." -ForegroundColor Gray
    gcloud storage buckets update $BucketUri --web-main-page-suffix=index.html --web-error-page=index.html
}

Write-Host ""
Write-Host "=== Deployment Completed Successfully! ===" -ForegroundColor Green
