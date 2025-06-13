# Migracle Serverless

This project is a serverless version of the Migracle website, designed to run on AWS using serverless technologies.

## Architecture

The application uses the following AWS services:

- **S3**: For static website hosting
- **CloudFront**: As a CDN for the static website
- **API Gateway**: For handling API requests
- **Lambda**: For serverless backend functions
- **DynamoDB**: For data storage

## Project Structure

```
migracle-serverless/
├── functions/                # Lambda functions
│   ├── contact-handler/      # Contact form handler
│   └── subscribe-handler/    # Subscription form handler
├── frontend/                 # Frontend code
│   ├── src/                  # React source code
│   │   ├── components/       # React components
│   │   └── index.js          # Main React entry point
│   ├── index.html            # Main HTML file
│   ├── styles.css            # CSS styles
│   ├── package.json          # Frontend dependencies
│   └── webpack.config.js     # Webpack configuration
├── template.yaml             # AWS SAM template
├── migrate-data.js           # Data migration script
├── migration-package.json    # Migration script dependencies
├── DEPLOYMENT_GUIDE.md       # Deployment instructions
├── DATA_MIGRATION_GUIDE.md   # Data migration instructions
└── COST_ESTIMATION.md        # Cost analysis
```

## Features

- **Static Website**: React-based frontend with Tailwind CSS
- **Serverless API**: API Gateway + Lambda functions
- **Database**: DynamoDB for storing contact and subscription data
- **Cost-Efficient**: Pay-per-use pricing model
- **Scalable**: Automatic scaling with demand
- **Low Maintenance**: No server management required

## Local Testing

Before deploying to the cloud, you can test the application locally using one of two methods:

1. **AWS SAM CLI Method**: Full emulation of AWS services (recommended for accuracy)
2. **Simple Express Server Method**: Lightweight alternative without Docker/SAM CLI requirements

See [LOCAL_TESTING.md](./LOCAL_TESTING.md) for detailed instructions on testing locally.

## Deployment

There are two options for deploying this application:

1. **AWS Management Console**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for UI-based deployment instructions.
2. **AWS SAM CLI**: See [SAM_DEPLOYMENT_GUIDE.md](./SAM_DEPLOYMENT_GUIDE.md) for CLI-based deployment instructions (recommended).

## Data Migration

See [DATA_MIGRATION_GUIDE.md](./DATA_MIGRATION_GUIDE.md) for instructions on migrating data from SQLite to DynamoDB.

## Cost Estimation

See [COST_ESTIMATION.md](./COST_ESTIMATION.md) for an analysis of the estimated costs of running this application on AWS.

## Migration Summary

See [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) for an overview of the migration process and benefits.
