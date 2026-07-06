#!/bin/bash

# Imagen 4 Image Generation Script for Migracle Website
# Uses Google Cloud Vertex AI Imagen 4 Ultra model
#
# Usage:
#   ./generate-images.sh              # Generate all images
#   ./generate-images.sh growth-isv   # Generate only growth-isv.jpg
#   ./generate-images.sh startup-credits growth-isv  # Generate specific images

set -e

# Configuration
PROJECT_ID="${PROJECT_ID:-migracle-gcp-2}"
LOCATION="us-central1"
MODEL="imagen-3.0-generate-002"
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
    local aspect_ratio="${3:-1:1}"

    echo -e "${BLUE}Generating:${NC} $output_file"
    echo "  Prompt: $prompt"

    # Create request JSON
    local request_json=$(cat <<EOF
{
  "instances": [
    {
      "prompt": "$prompt"
    }
  ],
  "parameters": {
    "sampleCount": 1,
    "aspectRatio": "$aspect_ratio",
    "outputOptions": {
      "mimeType": "image/jpeg"
    }
  }
}
EOF
)

    # Make API call
    local response=$(curl -s -X POST \
        -H "Authorization: Bearer $(gcloud auth print-access-token)" \
        -H "Content-Type: application/json; charset=utf-8" \
        -d "$request_json" \
        "https://${LOCATION}-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/${LOCATION}/publishers/google/models/${MODEL}:predict")

    # Check for errors
    if echo "$response" | grep -q '"error"'; then
        echo "  Error: $(echo "$response" | jq -r '.error.message // .error')"
        return 1
    fi

    # Extract base64 image and save
    echo "$response" | jq -r '.predictions[0].bytesBase64Encoded' | base64 -d > "$OUTPUT_DIR/$output_file"

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
        "A sophisticated 3D isometric diagram of an optimized, high-performance cloud stack on a pure black background. Neatly layered database tiers with thin glowing cyan lines, nested blue-green server container modules, and optimized resource flow. High contrast, clean minimalist tech illustration, sharp focus, professional tech aesthetic." \
        "region-expansion.jpg" \
        "16:9"
fi

# Use Case 2: Credit-Driven Cloud Migration
if should_generate "cloud-migration"; then
    generate_image \
        "A clean 3D isometric representation of cloud migration. On the left, orange infrastructure segments elegantly transform into vibrant blue-green containerized layers on the right. Glowing data packets and kubernetes pods flow gracefully between the environments. Pure black background, cyber-teal and orange neon accents, ultra-clean high-fidelity vector style." \
        "cloud-migration.jpg" \
        "16:9"
fi

# Use Case 3: The Compounded Runway Strategy
if should_generate "multi-cloud"; then
    generate_image \
        "Three interconnected glowing cloud nodes arranged in a clean triangular composition on a pure black background. Each cloud contains tiny, precise white wireframe icons of servers, storage disks, and databases. Glowing cyber-cyan and deep purple gradients, subtle light trails connecting the clusters to represent compounded, multi-layered optimization. Sleek minimalist tech aesthetic." \
        "multi-cloud.jpg" \
        "16:9"
fi

echo ""
echo "=== Generating Customer Persona Images ==="
echo ""

# Persona 1: Enterprise SaaS Vendors
if should_generate "enterprise-saas"; then
    generate_image \
        "A futuristic global network sphere centered on a pure black background. Transparent, glowing blue-green continents with precise data-center nodes emitting clean, bright neon-blue connection lines. Elegant high-contrast tech illustration, minimalist corporate cybersecurity aesthetic, sharp focus." \
        "enterprise-saas.jpg" \
        "4:3"
fi

# Persona 2: Growth-Stage ISVs
if should_generate "growth-isv"; then
    generate_image \
        "A highly professional dark office environment at night with a close-up focus on dual widescreen monitors. The screens display crisp, glowing analytics dashboards with upward-curving growth charts and financial ledgers. Out-of-focus background shows a sleek, modern tech workstation with cool cyan ambient lighting. Cinematic shallow depth of field, sharp focus on screen details." \
        "growth-isv.jpg" \
        "4:3"
fi

# Persona 3: Startups with Cloud Credits
if should_generate "startup-credits"; then
    generate_image \
        "A modern laptop opened on a clean dark desk, with the screen displaying a glowing cloud platform billing dashboard. The dashboard prominently highlights a verified promotional credit balance of 250,000 USD in a clean, modern digital layout, alongside server resource meters. Ambient deep blue and violet backlighting, sleek professional product photography, high contrast." \
        "startup-credits.jpg" \
        "4:3"
fi

echo ""
echo -e "${GREEN}=== Image Generation Complete ===${NC}"
echo "Generated images are in: $OUTPUT_DIR"
ls -la "$OUTPUT_DIR"/*.jpg 2>/dev/null | tail -6
