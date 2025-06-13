# Local Testing Guide for Migracle Serverless

This guide explains how to test your serverless application locally before deploying it to the cloud. We provide two methods for local testing:

1. **AWS SAM CLI Method** - Uses AWS SAM CLI to emulate AWS Lambda and API Gateway locally (recommended for the most accurate emulation)
2. **Simple Express Server Method** - Uses a simple Express server to emulate the API (easier setup, no Docker required)

## Method 1: Using AWS SAM CLI (Full Emulation)

### Prerequisites

Before you begin, make sure you have the following installed:

1. **AWS SAM CLI** - Used to emulate AWS Lambda and API Gateway locally
   - [Installation Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)

2. **Docker** - Required by SAM CLI to emulate AWS services
   - [Installation Guide](https://docs.docker.com/get-docker/)

3. **AWS CLI** - Used to interact with DynamoDB Local
   - [Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

4. **Node.js and npm** - Required to build the frontend
   - [Installation Guide](https://nodejs.org/en/download/)

### Running the Application Locally with SAM CLI

We've created a script that sets up the entire local development environment for you. This script:

1. Configures the frontend to use the local API endpoint
2. Builds the frontend
3. Starts DynamoDB Local
4. Creates the required DynamoDB tables
5. Starts the SAM Local API Gateway
6. Serves the frontend using a simple HTTP server

To run the application locally:

```bash
# Make sure Docker is running
# Then run the local development script
./local-dev.sh
```

This will start:
- Frontend server at http://localhost:8080/index.local.html
- API Gateway at http://localhost:3000
- DynamoDB Local at http://localhost:8000

## Method 2: Using Simple Express Server (Easier Setup)

### Prerequisites

For this method, you only need:

1. **Node.js and npm** - Required to run the local server
   - [Installation Guide](https://nodejs.org/en/download/)

### Running the Application Locally with Express

We've created a simple Express server that emulates the API Gateway and Lambda functions:

1. Install the required dependencies:

```bash
# Install dependencies for the local development server
npm install --prefix . -f local-dev-package.json
```

2. Run the local development server:

```bash
# Start the local development server
node simple-local-dev.js
```

This will:
- Start a local server at http://localhost:3000
- Create a modified index.html with the local API endpoint
- Open your browser automatically to http://localhost:3000/index.local.html

## Testing the Application

Regardless of which method you use:

1. Open the frontend in your browser (the URL will be shown in the terminal)
2. Test the subscription form in the hero section
3. Test the contact form by clicking the "Contact Us" button

All form submissions will be stored in the local database.

## Viewing Data

### For SAM CLI Method

You can view the data stored in your local DynamoDB tables using the AWS CLI:

```bash
# List all contacts
aws dynamodb scan --table-name migracle-contacts --endpoint-url http://localhost:8000 --region us-west-2

# List all subscribers
aws dynamodb scan --table-name migracle-subscribers --endpoint-url http://localhost:8000 --region us-west-2
```

### For Express Server Method

The data is stored in memory and can be viewed in the server logs. Each form submission will be logged to the console.

## Stopping the Local Environment

### For SAM CLI Method

To stop all the local servers, press Enter in the terminal where you ran the `local-dev.sh` script. The script will clean up all resources.

### For Express Server Method

Press Ctrl+C in the terminal where you ran the `simple-local-dev.js` script. The script will clean up resources automatically.

## Troubleshooting

### Common Issues for SAM CLI Method

1. **Docker not running**
   - Make sure Docker is running before starting the local development script

2. **Port conflicts**
   - If you see errors about ports being in use, make sure nothing else is running on ports 3000, 8000, and 8080

3. **AWS SAM CLI errors**
   - Make sure you have the latest version of AWS SAM CLI installed

4. **DynamoDB Local connection issues**
   - If the Lambda functions can't connect to DynamoDB Local, check that the endpoint URL is correct in the local-env.json file

### Common Issues for Express Server Method

1. **Port conflicts**
   - If you see errors about port 3000 being in use, make sure nothing else is running on that port

2. **Module not found errors**
   - Make sure you've installed the dependencies using the command provided

### Logs

- For both methods, server logs will be displayed in the terminal
- These logs can be helpful for debugging issues

## Differences from Cloud Deployment

When testing locally, there are a few differences from the cloud deployment:

1. Authentication and authorization are not enforced locally
2. Some AWS services might not be fully emulated
3. Performance characteristics will differ from the cloud environment
4. The Express server method uses in-memory storage instead of DynamoDB

These differences are generally acceptable for functional testing before deployment.

## Which Method Should I Use?

- **Use the SAM CLI method** if you want the most accurate emulation of the AWS environment and need to test specific AWS service integrations.

- **Use the Express server method** if you want a quick and simple way to test the frontend functionality without installing Docker and AWS SAM CLI.
