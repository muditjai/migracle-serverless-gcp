#!/bin/bash

# GCP Deployment Script for Migracle Serverless
# Using existing project: migracle-gcp-2

set -e

# Configuration
PROJECT_ID="migracle-gcp-2"
REGION="us-central1"
BUCKET_NAME="${PROJECT_ID}-website"

echo "🚀 Deploying Migracle to GCP..."
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"

# Step 1: Set up GCP project
echo "📦 Using existing GCP project..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable run.googleapis.com
echo "⏳ Waiting for APIs to be fully enabled..."
sleep 30

# Step 2: Initialize Firestore
echo "🗄️ Setting up Firestore..."
gcloud firestore databases create --location=$REGION --quiet || echo "Firestore already exists"

# Step 3: Deploy Contact Handler Cloud Function
echo "☁️ Deploying Contact Handler..."
cd gcp-functions/contact-handler
gcloud functions deploy contactHandler \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --region=$REGION \
  --memory=256MB \
  --timeout=60s \
  --entry-point=contactHandler

# Get the contact function URL
CONTACT_URL=$(gcloud functions describe contactHandler --region=$REGION --format="value(httpsTrigger.url)")
echo "Contact Handler URL: $CONTACT_URL"

# Step 4: Deploy Subscribe Handler Cloud Function
echo "📧 Deploying Subscribe Handler..."
cd ../subscribe-handler
gcloud functions deploy subscribeHandler \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated \
  --region=$REGION \
  --memory=256MB \
  --timeout=60s \
  --entry-point=subscribeHandler

# Get the subscribe function URL
SUBSCRIBE_URL=$(gcloud functions describe subscribeHandler --region=$REGION --format="value(httpsTrigger.url)")
echo "Subscribe Handler URL: $SUBSCRIBE_URL"

# Step 5: Create Storage bucket for static website
echo "🌐 Setting up static website hosting..."
cd ../../
gsutil mb -p $PROJECT_ID -c STANDARD -l $REGION gs://$BUCKET_NAME/ || echo "Bucket already exists"

# Enable static website hosting
gsutil web set -m index.html -e index.html gs://$BUCKET_NAME/

# Make bucket publicly readable
gsutil iam ch allUsers:objectViewer gs://$BUCKET_NAME/

# Step 6: Build and upload frontend
echo "🏗️ Building frontend..."
cd frontend
npm install
npm run build

# Update API endpoints in the built files
echo "🔗 Updating API endpoints..."
# Extract the base URL from the function URLs (remove the function name)
API_BASE_URL=$(echo $CONTACT_URL | sed 's|/contactHandler||')

# Create a temporary HTML file with updated API endpoint
sed "s|window\.API_ENDPOINT = '.*';|window.API_ENDPOINT = '$API_BASE_URL';|g" index.html > index_updated.html
mv index_updated.html index.html

# Upload frontend files
echo "📤 Uploading frontend files..."
gsutil -m rsync -r -d . gs://$BUCKET_NAME/

# Step 7: Set up HTTPS redirect (optional)
echo "🔒 Setting up HTTPS redirect..."
gsutil web set -m index.html -e index.html gs://$BUCKET_NAME/

# Get the website URL
WEBSITE_URL="https://storage.googleapis.com/$BUCKET_NAME/index.html"

echo ""
echo "✅ Deployment Complete!"
echo "🌐 Website URL: $WEBSITE_URL"
echo "📞 Contact API: $CONTACT_URL"  
echo "📧 Subscribe API: $SUBSCRIBE_URL"
echo ""
echo "🔧 Manual steps remaining:"
echo "1. Set up custom domain (optional)"
echo "2. Configure Cloud CDN for better performance"
echo "3. Set up monitoring and logging"
echo ""
echo "Test your APIs:"
echo "curl -X POST $CONTACT_URL -H 'Content-Type: application/json' -d '{\"name\":\"Test\",\"email\":\"test@example.com\",\"message\":\"Hello\"}'"
echo "curl -X POST $SUBSCRIBE_URL -H 'Content-Type: application/json' -d '{\"email\":\"test@example.com\"}'"