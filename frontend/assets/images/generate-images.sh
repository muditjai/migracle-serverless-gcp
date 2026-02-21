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
MODEL="imagen-4.0-ultra-generate-001"
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

# Use Case 1: AWS Region Expansion
if should_generate "region-expansion"; then
    generate_image \
        "Modern digital illustration of a world map with crisp bright glowing data center nodes, prominent sharp nodes located in USA, Brazil, Europe, Middle East, South Africa, India, Australia, and Japan. Nodes are bright white-blue points connected by subtle thin light trails. Blue and cyan color scheme, pure black background, professional tech aesthetic, no text or logos, clean minimal design, high contrast" \
        "region-expansion.jpg" \
        "16:9"
fi

# Use Case 2: AWS to GCP Migration
if should_generate "cloud-migration"; then
    generate_image \
        "Sophisticated 3D isometric visualization of cloud infrastructure migration, left side showing orange AWS-style server architecture transforming into right side blue-green GCP-style architecture, data packets and containers flowing between them, showing compute instances, databases, storage buckets being replicated, dark background with blue and teal accents, high fidelity tech illustration, no text" \
        "cloud-migration.jpg" \
        "16:9"
fi

# Use Case 3: Multi-Cloud Deployment
if should_generate "multi-cloud"; then
    generate_image \
        "Three large prominent cloud platforms arranged in triangle, each cloud containing visible service icons for compute servers, storage disks, networking nodes, security shields, and IAM keys being synchronized. Minimal subtle connection lines between clouds, clouds are the focus. Dark black background, blue purple and cyan color scheme matching modern tech website, clean professional illustration, no text" \
        "multi-cloud.jpg" \
        "16:9"
fi

echo ""
echo "=== Generating Customer Persona Images ==="
echo ""

# Persona 1: Enterprise SaaS Vendors
if should_generate "enterprise-saas"; then
    generate_image \
        "Clean modern illustration of a globe with multiple office buildings in different continents connected by glowing network lines, representing global enterprise expansion. Dark black background, blue and cyan color scheme, professional minimalist tech aesthetic, no text, no map overlay, clean separation of elements" \
        "enterprise-saas.jpg" \
        "4:3"
fi

# Persona 2: Growth-Stage ISVs
if should_generate "growth-isv"; then
    generate_image \
        "Photorealistic image of 2-3 people in a modern tech office looking at computer monitors displaying growth charts and upward trending graphs, revenue metrics going up, cool blue lighting, dark modern office environment, professional focused atmosphere, screens glowing with analytics dashboards, no warm tones, cinematic photography style" \
        "growth-isv.jpg" \
        "4:3"
fi

# Persona 3: Startups with Cloud Credits
if should_generate "startup-credits"; then
    generate_image \
        "Photorealistic image of a laptop screen showing a cloud provider dashboard with credit balance displaying 250000 dollars, cloud infrastructure icons, servers and databases visible, startup office desk environment, cool blue and purple ambient lighting, dark background, professional tech photography, clean modern composition" \
        "startup-credits.jpg" \
        "4:3"
fi

echo ""
echo -e "${GREEN}=== Image Generation Complete ===${NC}"
echo "Generated images are in: $OUTPUT_DIR"
ls -la "$OUTPUT_DIR"/*.jpg 2>/dev/null | tail -6
