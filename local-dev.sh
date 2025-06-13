#!/bin/bash

# Exit on error
set -e

echo "Setting up local development environment for Migracle Serverless..."

# Check if AWS SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo "AWS SAM CLI is not installed. Please install it first:"
    echo "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html"
    exit 1
fi

# Check if Docker is running (required for SAM and DynamoDB Local)
if ! docker info &> /dev/null; then
    echo "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Create a temporary copy of index.html with local API endpoint
echo "Configuring frontend to use local API endpoint..."
sed 's|window.API_ENDPOINT = .*|window.API_ENDPOINT = '\''http://localhost:3000'\'';|' frontend/index.html > frontend/index.local.html

# Install frontend dependencies if needed
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
fi

# Build the frontend
echo "Building frontend..."
cd frontend && npm run build && cd ..

# Create local DynamoDB tables
echo "Creating local DynamoDB tables..."
cat > create-local-tables.json << EOL
{
    "ContactsTable": {
        "Type": "AWS::DynamoDB::Table",
        "Properties": {
            "TableName": "migracle-contacts",
            "AttributeDefinitions": [
                {
                    "AttributeName": "id",
                    "AttributeType": "S"
                }
            ],
            "KeySchema": [
                {
                    "AttributeName": "id",
                    "KeyType": "HASH"
                }
            ],
            "ProvisionedThroughput": {
                "ReadCapacityUnits": 5,
                "WriteCapacityUnits": 5
            }
        }
    },
    "SubscribersTable": {
        "Type": "AWS::DynamoDB::Table",
        "Properties": {
            "TableName": "migracle-subscribers",
            "AttributeDefinitions": [
                {
                    "AttributeName": "email",
                    "AttributeType": "S"
                }
            ],
            "KeySchema": [
                {
                    "AttributeName": "email",
                    "KeyType": "HASH"
                }
            ],
            "ProvisionedThroughput": {
                "ReadCapacityUnits": 5,
                "WriteCapacityUnits": 5
            }
        }
    }
}
EOL

# Start DynamoDB Local in a separate terminal
echo "Starting DynamoDB Local..."
osascript -e 'tell app "Terminal" to do script "cd '$PWD' && sam local start-dynamodb --port 8000"'

# Wait for DynamoDB to start
echo "Waiting for DynamoDB Local to start..."
sleep 5

# Create tables in DynamoDB Local
echo "Creating tables in DynamoDB Local..."
aws dynamodb create-table \
    --table-name migracle-contacts \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url http://localhost:8000 \
    --region us-west-2 || true

aws dynamodb create-table \
    --table-name migracle-subscribers \
    --attribute-definitions AttributeName=email,AttributeType=S \
    --key-schema AttributeName=email,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --endpoint-url http://localhost:8000 \
    --region us-west-2 || true

# Start SAM Local API in a separate terminal
echo "Starting SAM Local API Gateway..."
osascript -e 'tell app "Terminal" to do script "cd '$PWD' && sam local start-api --port 3000 --env-vars local-env.json"'

# Create local environment variables file
cat > local-env.json << EOL
{
  "ContactFunction": {
    "REGION": "us-west-2",
    "DYNAMODB_ENDPOINT": "http://host.docker.internal:8000"
  },
  "SubscribeFunction": {
    "REGION": "us-west-2",
    "DYNAMODB_ENDPOINT": "http://host.docker.internal:8000"
  }
}
EOL

# Start a simple HTTP server to serve the frontend
echo "Starting frontend server..."
osascript -e 'tell app "Terminal" to do script "cd '$PWD'/frontend && python -m http.server 8080"'

echo "Local development environment is ready!"
echo "Frontend: http://localhost:8080/index.local.html"
echo "API Gateway: http://localhost:3000"
echo "DynamoDB Local: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop the servers"

# Keep the script running
read -p "Press Enter to stop all servers..."

# Clean up
echo "Cleaning up..."
pkill -f "sam local start-api" || true
pkill -f "sam local start-dynamodb" || true
pkill -f "python -m http.server" || true
rm -f create-local-tables.json local-env.json frontend/index.local.html

echo "Local development environment stopped."
