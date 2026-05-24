#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status
set -e

# Help message
show_help() {
  echo "Usage: ./deploy.sh -e <environment> [-p <provider>] [-c <channel>]"
  echo "  -e: target environment ('feature' or 'prd') [required]"
  echo "  -p: provider ('firebase' or 'gcs') [default: firebase]"
  echo "  -c: hosting channel ('live' or a preview channel name) [default: live]"
  exit 1
}

# Default values
PROVIDER="firebase"
CHANNEL="live"
ENVIRONMENT=""

# Parse command line options
while getopts "e:p:c:h" opt; do
  case "$opt" in
    e) ENVIRONMENT=$OPTARG ;;
    p) PROVIDER=$OPTARG ;;
    c) CHANNEL=$OPTARG ;;
    h) show_help ;;
    *) show_help ;;
  esac
done

# Validate inputs
if [ -z "$ENVIRONMENT" ]; then
  echo "Error: Environment (-e) is required."
  show_help
fi

if [ "$ENVIRONMENT" != "feature" ] && [ "$ENVIRONMENT" != "prd" ]; then
  echo "Error: Environment must be 'feature' or 'prd'."
  show_help
fi

if [ "$PROVIDER" != "firebase" ] && [ "$PROVIDER" != "gcs" ]; then
  echo "Error: Provider must be 'firebase' or 'gcs'."
  show_help
fi

FIREBASE_PROJECT="edumoni"

echo -e "\033[0;36m=== Starting EduMoni Deploy Script ===\033[0m"
echo -e "\033[0;33mTarget Environment: $ENVIRONMENT\033[0m"
echo -e "\033[0;33mProvider:           $PROVIDER\033[0m"
echo -e "\033[0;33mChannel/Target:     $CHANNEL\033[0m"
echo ""

# 1. Build and Prepare Assets
echo -e "\033[0;36mStep 1: Installing dependencies and building assets...\033[0m"
if ! command -v npm &> /dev/null; then
  echo "Error: npm (Node.js) is not installed. Please install Node.js and try again."
  exit 1
fi

echo "Running: npm install"
npm install

echo "Running: npm run build"
npm run build

if [ ! -d "dist" ]; then
  echo "Error: Build directory 'dist' was not created. Build failed."
  exit 1
fi
echo -e "\033[0;32mBuild completed successfully.\033[0m"
echo ""

# 2. Deploy
if [ "$PROVIDER" = "firebase" ]; then
  echo -e "\033[0;36mStep 2: Deploying to Firebase Hosting...\033[0m"
  if ! command -v firebase &> /dev/null; then
    echo "Error: Firebase CLI ('firebase') is not installed."
    echo "Install it via 'npm install -g firebase-tools' and log in using 'firebase login'."
    exit 1
  fi

  echo "Deploying to project: $FIREBASE_PROJECT, target: $ENVIRONMENT"
  if [ "$CHANNEL" = "live" ]; then
    firebase deploy --only hosting:"$ENVIRONMENT" --project "$FIREBASE_PROJECT"
  else
    echo "Deploying to preview channel '$CHANNEL'..."
    firebase hosting:channel:deploy "$CHANNEL" --only hosting:"$ENVIRONMENT" --project "$FIREBASE_PROJECT"
  fi

elif [ "$PROVIDER" = "gcs" ]; then
  echo -e "\033[0;36mStep 2: Deploying to Google Cloud Storage (GCS)...\033[0m"
  if ! command -v gcloud &> /dev/null; then
    echo "Error: Google Cloud SDK ('gcloud') is not installed or not in PATH."
    exit 1
  fi

  if [ "$ENVIRONMENT" = "prd" ]; then
    BUCKET_NAME="edumoni-prd-bucket"
  else
    BUCKET_NAME="edumoni-feature-bucket"
  fi
  BUCKET_URI="gs://$BUCKET_NAME"

  echo "Target Bucket: $BUCKET_URI"
  
  # Sync directories
  echo "Synchronizing build directory 'dist' to $BUCKET_URI..."
  gcloud storage rsync dist "$BUCKET_URI" --recursive --delete-unmatched

  # Set web access configuration
  echo "Setting GCS website configuration..."
  gcloud storage buckets update "$BUCKET_URI" --web-main-page-suffix=index.html --web-error-page=index.html
fi

echo ""
echo -e "\033[0;32m=== Deployment Completed Successfully! ===\033[0m"
