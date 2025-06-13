#!/bin/bash

# Create necessary directories
mkdir -p migracle-serverless/frontend/assets/images
mkdir -p migracle-serverless/frontend/assets/icons.ico

# Copy images
cp assets/arc-crop.png migracle-serverless/frontend/assets/
cp assets/cta.png migracle-serverless/frontend/assets/
cp assets/logo.png migracle-serverless/frontend/assets/

# Copy image files
cp assets/images/case1.jpeg migracle-serverless/frontend/assets/images/
cp assets/images/case2.jpeg migracle-serverless/frontend/assets/images/
cp assets/images/case3.jpeg migracle-serverless/frontend/assets/images/
cp assets/images/case11.jpeg migracle-serverless/frontend/assets/images/
cp assets/images/case12.jpeg migracle-serverless/frontend/assets/images/
cp assets/images/coming-soon.jpeg migracle-serverless/frontend/assets/images/
cp assets/images/data-transfer.jpeg migracle-serverless/frontend/assets/images/
cp assets/images/observability.jpeg migracle-serverless/frontend/assets/images/

# Copy icons
cp -r assets/icons.ico/* migracle-serverless/frontend/assets/icons.ico/

echo "Assets copied successfully!"
