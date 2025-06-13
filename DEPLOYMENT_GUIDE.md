# Migracle Serverless Deployment Guide

This guide provides detailed, step-by-step instructions for deploying the Migracle serverless application using the AWS Management Console (UI).

## Prerequisites

- An AWS account with appropriate permissions
- Basic familiarity with AWS services
- The migracle-serverless project files

## Deployment Steps

### Step 1: Deploy the Backend Infrastructure with CloudFormation

1. **Sign in to the AWS Management Console**
   - Go to https://console.aws.amazon.com/
   - Sign in with your AWS account credentials

2. **Navigate to CloudFormation**
   - In the AWS Management Console, search for "CloudFormation" in the search bar
   - Click on "CloudFormation" in the search results

3. **Create a new stack**
   - Click the "Create stack" button
   - Select "With new resources (standard)"

4. **Specify template**
   - Select "Upload a template file"
   - Click "Choose file" and select the `template.yaml` file from your migracle-serverless project
   - Click "Next"

5. **Specify stack details**
   - Enter a Stack name (e.g., "migracle-serverless")
   - Review any parameters (if applicable)
   - Click "Next"

6. **Configure stack options**
   - Add any tags if needed (optional)
   - Configure any stack options if needed (optional)
   - Click "Next"

7. **Review and create**
   - Review all the details
   - Check the acknowledgment box for IAM resources (if prompted)
   - Click "Create stack"

8. **Wait for stack creation**
   - This process may take 5-10 minutes
   - The status will change to "CREATE_COMPLETE" when finished

9. **Note the outputs**
   - Go to the "Outputs" tab of your stack
   - Note the following values:
     - `ApiEndpoint`: The URL for your API Gateway
     - `WebsiteURL`: The URL for your S3 website
     - `CloudFrontURL`: The URL for your CloudFront distribution

### Step 2: Update the Frontend Configuration

1. **Update the API endpoint in the frontend code**
   - Open the `frontend/index.html` file in a text editor
   - Find the line with `window.API_ENDPOINT = 'https://YOUR_API_GATEWAY_ID.execute-api.us-west-2.amazonaws.com/prod';`
   - Replace the URL with the `ApiEndpoint` value from the CloudFormation outputs
   - Save the file

### Step 3: Build the Frontend

1. **Install dependencies and build**
   - Open a terminal/command prompt
   - Navigate to the frontend directory:
     ```bash
     cd migracle-serverless/frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Build the project:
     ```bash
     npm run build
     ```
   - This will create a `dist` folder with the bundled JavaScript

### Step 4: Upload Frontend Files to S3

1. **Navigate to S3 in the AWS Console**
   - In the AWS Management Console, search for "S3" in the search bar
   - Click on "S3" in the search results

2. **Find your bucket**
   - Look for a bucket named like "migracle-website-{account-id}"
   - Click on the bucket name to open it

3. **Upload files**
   - Click the "Upload" button
   - Click "Add files" and "Add folder" to select the following:
     - `index.html` from the frontend directory
     - `styles.css` from the frontend directory
     - The entire `dist` folder (containing `bundle.js`)
   - Click "Upload"

4. **Create an assets folder (if needed)**
   - Click "Create folder"
   - Name it "assets"
   - Click "Create folder"
   - Navigate into the assets folder
   - Upload any images or other assets needed by the website

### Step 5: Test the Deployment

1. **Access the website**
   - Use the `CloudFrontURL` from the CloudFormation outputs
   - Open this URL in a web browser

2. **Test functionality**
   - Test the subscription form in the hero section
   - Test the contact form by clicking the "Contact Us" button

3. **Verify data storage**
   - Navigate to DynamoDB in the AWS Console
   - Check the "migracle-contacts" and "migracle-subscribers" tables to verify that data is being stored correctly

## Troubleshooting

### API Gateway Issues

If the forms aren't working:

1. **Check CORS configuration**
   - In the AWS Console, navigate to API Gateway
   - Select your API
   - Go to the "Resources" section
   - Verify that CORS is enabled for your resources

2. **Check Lambda function logs**
   - In the AWS Console, navigate to CloudWatch
   - Go to "Log groups"
   - Look for log groups related to your Lambda functions
   - Check the logs for any errors

### S3/CloudFront Issues

If the website isn't loading correctly:

1. **Check S3 bucket configuration**
   - Verify that the bucket has public read access
   - Check that the bucket policy allows GetObject actions

2. **Check CloudFront distribution**
   - Verify that the distribution is deployed (status: Deployed)
   - Check that the origin settings point to the correct S3 bucket

3. **Clear browser cache**
   - Try accessing the site in an incognito/private window
   - Clear your browser cache and try again

## Updating the Application

To update the application after making changes:

1. **Update CloudFormation stack**
   - If you've made changes to the `template.yaml` file:
     - In CloudFormation, select your stack
     - Click "Update"
     - Choose "Replace current template"
     - Upload the updated template
     - Follow the wizard to update the stack

2. **Update frontend code**
   - Make your changes to the frontend code
   - Rebuild the frontend:
     ```bash
     cd frontend
     npm run build
     ```
   - Re-upload the updated files to S3

3. **Invalidate CloudFront cache (if needed)**
   - In the CloudFront console, select your distribution
   - Go to the "Invalidations" tab
   - Create a new invalidation with the path "/*" to invalidate all objects
