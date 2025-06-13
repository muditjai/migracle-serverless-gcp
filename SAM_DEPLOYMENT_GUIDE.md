# Migracle Serverless Deployment Guide using AWS SAM CLI

This guide provides step-by-step instructions for deploying the Migracle serverless application using the AWS SAM CLI. This is the recommended deployment method as it properly packages your Lambda functions and uploads them to S3 before deployment.

## Prerequisites

- An AWS account with appropriate permissions
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) installed
- [AWS CLI](https://aws.amazon.com/cli/) installed and configured with your AWS credentials
  ```bash
  aws configure
  # You'll be prompted to enter:
  # - AWS Access Key ID
  # - AWS Secret Access Key
  # - Default region name (e.g., us-west-2)
  # - Default output format (json)
  ```
- [Node.js and npm](https://nodejs.org/) installed
- The migracle-serverless project files

## Deployment Steps

### Step 1: Install Dependencies

1. Install the Lambda function dependencies:

```bash
# Install contact-handler dependencies
cd functions/contact-handler
npm install
cd ../..

# Install subscribe-handler dependencies
cd functions/subscribe-handler
npm install
cd ../..
```

### Step 2: Package the Application

The SAM CLI will package your application by uploading the Lambda function code to an S3 bucket and generating a new CloudFormation template with the correct S3 URIs. This step resolves the "CodeUri is not a valid S3 Uri" error that occurs when trying to deploy directly through CloudFormation.

```bash
# Create an S3 bucket for deployment (if you don't already have one)
# Note: S3 bucket names must be globally unique across all AWS accounts
aws s3 mb s3://migracle-deployment-bucket-YOUR-ACCOUNT-ID --region us-west-2

# Package the application
sam package \
  --template-file template.yaml \
  --s3-bucket migracle-deployment-bucket-YOUR-ACCOUNT-ID \
  --output-template-file packaged.yaml \
  --region us-west-2
```

Note: Replace `migracle-deployment-bucket-YOUR-ACCOUNT-ID` with a unique bucket name. Adding your AWS account ID to the bucket name is a good way to ensure uniqueness.

### Step 3: Deploy the Application

```bash
# Deploy the packaged application
sam deploy \
  --template-file packaged.yaml \
  --stack-name migracle-serverless \
  --capabilities CAPABILITY_IAM \
  --region us-west-2
```

### Step 4: Get the Deployment Outputs

After the deployment is complete, you can get the outputs (API endpoint, S3 website URL, CloudFront URL) using the following command:

```bash
aws cloudformation describe-stacks \
  --stack-name migracle-serverless \
  --query "Stacks[0].Outputs" \
  --region us-west-2
```

Note the following values from the outputs:
- `ApiEndpoint`: The URL for your API Gateway
- `WebsiteURL`: The URL for your S3 website
- `CloudFrontURL`: The URL for your CloudFront distribution

### Step 5: Update the Frontend Configuration

1. Update the API endpoint in the frontend code:

```bash
# Get the API endpoint from CloudFormation outputs
API_ENDPOINT=$(aws cloudformation describe-stacks \
  --stack-name migracle-serverless \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text \
  --region us-west-2)

echo "Your API endpoint is: $API_ENDPOINT"

# Update the frontend configuration
# For macOS:
sed -i '' "s|window.API_ENDPOINT = .*|window.API_ENDPOINT = '$API_ENDPOINT';|" frontend/index.html

# For Linux:
# sed -i "s|window.API_ENDPOINT = .*|window.API_ENDPOINT = '$API_ENDPOINT';|" frontend/index.html
```

Or manually:
- Open the `frontend/index.html` file in a text editor
- Find the line with `window.API_ENDPOINT = 'https://YOUR_API_GATEWAY_ID.execute-api.us-west-2.amazonaws.com/prod';`
- Replace the URL with the `ApiEndpoint` value from the CloudFormation outputs
- Save the file

### Step 6: Build the Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Build the project
npm run build

# Return to the project root
cd ..
```

### Step 7: Upload Frontend Files to S3

```bash
# Get the S3 bucket name from CloudFormation
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name migracle-serverless \
  --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" \
  --output text \
  --region us-west-2 | sed 's|http://\(.*\).s3-website.*|\1|')

echo "Your S3 bucket name is: $BUCKET_NAME"

# Upload the frontend files
aws s3 cp frontend/index.html s3://$BUCKET_NAME/
aws s3 cp frontend/styles.css s3://$BUCKET_NAME/
aws s3 cp frontend/dist/bundle.js s3://$BUCKET_NAME/ # Note the dist/ directory
aws s3 cp --recursive frontend/assets/ s3://$BUCKET_NAME/assets/

echo "Frontend files uploaded successfully"
```

### Step 8: Invalidate CloudFront Cache (if needed)

```bash
# Get the CloudFront URL from CloudFormation
CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
  --stack-name migracle-serverless \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontURL'].OutputValue" \
  --output text \
  --region us-west-2)

echo "Your CloudFront URL is: $CLOUDFRONT_URL"

# Extract the domain name
CLOUDFRONT_DOMAIN=$(echo $CLOUDFRONT_URL | sed 's|https://||')

# Get the CloudFront distribution ID
DISTRIBUTION_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?DomainName=='$CLOUDFRONT_DOMAIN'].Id" \
  --output text \
  --region us-west-2)

echo "Your CloudFront distribution ID is: $DISTRIBUTION_ID"

# Create an invalidation
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*" \
  --region us-west-2

echo "CloudFront cache invalidation created"
```

### Step 9: Test the Deployment

1. Get the CloudFront URL:
```bash
aws cloudformation describe-stacks \
  --stack-name migracle-serverless \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontURL'].OutputValue" \
  --output text \
  --region us-west-2
```

2. Open the URL in your browser
3. Test the subscription form in the hero section
4. Test the contact form by clicking the "Contact Us" button
5. Verify that form submissions are stored in DynamoDB:
```bash
# Check contacts table
aws dynamodb scan --table-name migracle-contacts --region us-west-2

# Check subscribers table
aws dynamodb scan --table-name migracle-subscribers --region us-west-2
```

## Updating the Application

To update the application after making changes:

1. Make your changes to the code
2. Re-package and deploy the application:

```bash
# Package the application
sam package \
  --template-file template.yaml \
  --s3-bucket migracle-deployment-bucket-YOUR-ACCOUNT-ID \
  --output-template-file packaged.yaml \
  --region us-west-2

# Deploy the packaged application
sam deploy \
  --template-file packaged.yaml \
  --stack-name migracle-serverless \
  --capabilities CAPABILITY_IAM \
  --region us-west-2 \
  --no-fail-on-empty-changeset
```

3. If you've made changes to the frontend, rebuild and re-upload:

```bash
# Build the frontend
cd frontend
npm run build
cd ..

# Get the S3 bucket name
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name migracle-serverless \
  --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" \
  --output text \
  --region us-west-2 | sed 's|http://\(.*\).s3-website.*|\1|')

# Upload the frontend files
aws s3 cp frontend/index.html s3://$BUCKET_NAME/
aws s3 cp frontend/styles.css s3://$BUCKET_NAME/
aws s3 cp frontend/bundle.js s3://$BUCKET_NAME/
# If you've added new assets:
aws s3 cp --recursive frontend/assets/ s3://$BUCKET_NAME/assets/

# Get the CloudFront domain
CLOUDFRONT_DOMAIN=$(aws cloudformation describe-stacks \
  --stack-name migracle-serverless \
  --query "Stacks[0].Outputs[?OutputKey=='CloudFrontURL'].OutputValue" \
  --output text \
  --region us-west-2 | sed 's|https://||')

# Get the CloudFront distribution ID
DISTRIBUTION_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?DomainName=='$CLOUDFRONT_DOMAIN'].Id" \
  --output text \
  --region us-west-2)

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*" \
  --region us-west-2
```

## Troubleshooting

### SAM CLI Issues

If you encounter issues with the SAM CLI:

1. Make sure you have the latest version installed:
```bash
pip install --upgrade aws-sam-cli
```

2. Check that your AWS credentials are configured correctly:
```bash
aws configure list
```

3. If you get "CodeUri is not a valid S3 Uri" error:
   - This means you're trying to deploy the template directly through CloudFormation without packaging it first
   - Make sure to run the `sam package` command before `sam deploy`

4. If you get "Access Denied" errors:
   - Check that your AWS credentials have the necessary permissions
   - You may need to add additional IAM policies to your user

### API Gateway Issues

If the forms aren't working:

1. Check the Lambda function logs in CloudWatch:
```bash
# Get the Lambda function name
aws cloudformation describe-stack-resources \
  --stack-name migracle-serverless \
  --logical-resource-id ContactFunction \
  --query "StackResources[0].PhysicalResourceId" \
  --output text \
  --region us-west-2

# View the logs
aws logs describe-log-streams \
  --log-group-name /aws/lambda/FUNCTION_NAME \
  --region us-west-2

aws logs get-log-events \
  --log-group-name /aws/lambda/FUNCTION_NAME \
  --log-stream-name STREAM_NAME \
  --region us-west-2
```

2. Verify that CORS is configured correctly in the API Gateway:
```bash
# Get the API Gateway ID
aws cloudformation describe-stack-resources \
  --stack-name migracle-serverless \
  --logical-resource-id MigracleApi \
  --query "StackResources[0].PhysicalResourceId" \
  --output text \
  --region us-west-2

# Check the CORS configuration
aws apigateway get-resource \
  --rest-api-id API_ID \
  --resource-id RESOURCE_ID \
  --region us-west-2
```

### S3/CloudFront Issues

If the website isn't loading correctly:

1. Check that the files were uploaded to the S3 bucket correctly:
```bash
aws s3 ls s3://BUCKET_NAME/ --region us-west-2
```

2. Verify that the bucket policy allows public read access:
```bash
aws s3api get-bucket-policy --bucket BUCKET_NAME --region us-west-2
```

3. Check that the CloudFront distribution is deployed:
```bash
aws cloudfront get-distribution --id DISTRIBUTION_ID --region us-west-2
```

4. Try clearing your browser cache or accessing the site in an incognito window

### DynamoDB Issues

If data isn't being stored correctly:

1. Check that the tables exist:
```bash
aws dynamodb list-tables --region us-west-2
```

2. Check the table contents:
```bash
aws dynamodb scan --table-name migracle-contacts --region us-west-2
aws dynamodb scan --table-name migracle-subscribers --region us-west-2
```

3. Check that the Lambda functions have the correct permissions to access DynamoDB:
```bash
# Get the Lambda function role
aws lambda get-function \
  --function-name FUNCTION_NAME \
  --query "Configuration.Role" \
  --output text \
  --region us-west-2

# Check the role policies
aws iam list-attached-role-policies \
  --role-name ROLE_NAME \
  --region us-west-2
```
