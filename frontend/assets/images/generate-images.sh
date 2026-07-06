#!/bin/bash

# Imagen 4 / Gemini 3.1 Image Generation Script for Migracle Website
# Uses Google Cloud Vertex AI Gemini 3.1 Flash Image model
#
# Usage:
#   ./generate-images.sh              # Generate all images
#   ./generate-images.sh growth-isv   # Generate only growth-isv.jpg
#   ./generate-images.sh startup-credits growth-isv  # Generate specific images

set -e

# Configuration
PROJECT_ID="${PROJECT_ID:-migracle-gcp-2}"
LOCATION="us-central1"
MODEL="gemini-3.1-flash-image"
OUTPUT_DIR="$(dirname "$0")"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Migracle Image Generation Script ===${NC}"
echo "Project: $PROJECT_ID"
echo "Model: $MODEL"
echo "Output Directory: $OUTPUT_DIR"
echo ""

# Check if gcloud is authenticated
if ! gcloud auth print-access-token &>/dev/null; then
    echo "Error: Please authenticate with gcloud first:"
    echo "  gcloud auth login"
    echo "  gcloud config set project $PROJECT_ID"
    exit 1
fi

# Function to generate image
generate_image() {
    local prompt="$1"
    local output_file="$2"

    echo -e "${BLUE}Generating:${NC} $output_file"
    echo "  Prompt: $prompt"

    # Create request JSON using jq for safety and robust escaping
    local request_json=$(jq -n \
        --arg prompt "$prompt" \
        '{
          "contents": {
            "role": "user",
            "parts": {
              "text": $prompt
            }
          },
          "generation_config": {
            "response_modalities": ["IMAGE"]
          }
        }')

    # Make API call using the global generateContent endpoint for Gemini 3.1
    local response=$(curl -s -X POST \
        -H "Authorization: Bearer $(gcloud auth print-access-token)" \
        -H "Content-Type: application/json; charset=utf-8" \
        -d "$request_json" \
        "https://aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/global/publishers/google/models/${MODEL}:generateContent")

    # Check for errors
    if echo "$response" | grep -q '"error"'; then
        echo "  Error: $(echo "$response" | jq -r '.error.message // .error')"
        return 1
    fi

    # Extract base64 image and save
    echo "$response" | jq -r '.candidates[0].content.parts[0].inlineData.data' | base64 -d > "$OUTPUT_DIR/$output_file"

    if [ -f "$OUTPUT_DIR/$output_file" ]; then
        echo -e "  ${GREEN}Saved:${NC} $OUTPUT_DIR/$output_file ($(du -h "$OUTPUT_DIR/$output_file" | cut -f1))"
    else
        echo "  Error: Failed to save image"
        return 1
    fi
}

# Check if specific images requested
REQUESTED_IMAGES="$@"

should_generate() {
    local image_name="$1"
    if [ -z "$REQUESTED_IMAGES" ]; then
        return 0  # Generate all if no args
    fi
    for req in $REQUESTED_IMAGES; do
        if [ "$req" = "$image_name" ] || [ "$req" = "${image_name}.jpg" ]; then
            return 0
        fi
    done
    return 1
}

echo "=== Generating Use Case Images ==="
echo ""

# Use Case 1: Cloud Stack Optimization
if should_generate "region-expansion"; then
    generate_image \
        "A realistic, professional photograph of a spacious, modern corporate office building. On a large, sleek desk, a massive, widescreen high-resolution monitor displays a detailed, clean AWS and GCP cloud billing and cost management dashboard, highlighting a significant cost reduction graph with a 'Cloud Bill Optimization: -45% Savings' annotation. In the blurred background, a sophisticated glass-walled office space with natural daylight, sharp focus, 16:9 aspect ratio." \
        "region-expansion.jpg"
fi

# Use Case 2: Credit-Driven Cloud Migration
if should_generate "cloud-migration"; then
    generate_image \
        "A crisp, realistic photograph of a modern enterprise conference room table. On the table, a premium business laptop shows a clean, professional migration progress terminal. In the background on a clean glass wall, a sleek, minimalist illuminated diagram showing a transition from the 'AWS' cloud icon to the 'GCP' cloud icon with a clean flowing arrow. Grounded, authentic corporate setting with soft ambient lighting, 16:9 aspect ratio." \
        "cloud-migration.jpg"
fi

# Use Case 3: The Compounded Runway Strategy
if should_generate "multi-cloud"; then
    generate_image \
        "A professional, realistic photograph of a modern glass-walled corporate meeting room. On a large, clean whiteboard, a beautifully hand-drawn, precise diagram of a 'Compounded Runway Strategy' is shown, detailing 'Step 1: Optimize Existing Stack' and 'Step 2: Migrate to Credit Provider' with flowcharts and server icons. Grounded, authentic business environment, crisp focus on the whiteboard, soft cinematic lighting, extremely professional and convincing, 16:9 aspect ratio." \
        "multi-cloud.jpg"
fi

echo ""
echo "=== Generating Customer Persona Images ==="
echo ""

# Persona 1: Enterprise SaaS Vendors
if should_generate "enterprise-saas"; then
    generate_image \
        "A cinematic, highly detailed, realistic photograph of a majestic enterprise data center hall. Infinite rows of sleek, modern black server cabinets stretching into the distance with glowing deep-blue and white status indicators. A perfectly polished floor reflecting the lights, creating a sense of epic scale and premium security. Cool professional color grading, ultra-sharp focus, 4:3 aspect ratio." \
        "enterprise-saas.jpg"
fi

# Persona 2: Growth-Stage ISVs
if should_generate "growth-isv"; then
    generate_image \
        "A bright, modern, and inspiring tech startup office with natural daylight. In the foreground, a beautifully designed, clean and empty wooden desk with soft shadows. In the background, softly blurred professional team members are seen actively collaborating, discussing at a whiteboard, and working together. Professional architectural photography style, optimistic and productive vibe, 4:3 aspect ratio." \
        "growth-isv.jpg"
fi

# Persona 3: Startups with Cloud Credits
if should_generate "startup-credits"; then
    generate_image \
        "A close-up, premium lifestyle product photograph of a modern aluminum laptop open on a minimalist concrete desk. The laptop screen displays a pristine cloud platform console dashboard with a verified promotional credit balance of '$250,000' and a runway chart. Next to the laptop sits a high-end ceramic mug of hot coffee. Soft, crisp morning shadows, natural and clean aesthetic, 4:3 aspect ratio." \
        "startup-credits.jpg"
fi

echo ""
echo -e "${GREEN}=== Image Generation Complete ===${NC}"
echo "Generated images are in: $OUTPUT_DIR"
ls -la "$OUTPUT_DIR"/*.jpg 2>/dev/null | tail -6
