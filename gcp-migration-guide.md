# Migracle AWS to GCP Migration Guide

## Quick Start

### Prerequisites
- GCP project `migracle-gcp-2` (already exists)
- gcloud CLI installed and authenticated
- Node.js and npm installed

### 1. Deploy to GCP
```bash
# Make the script executable
chmod +x deploy-gcp.sh

# Run the deployment
./deploy-gcp.sh
```

### 2. Manual Steps After Deployment

#### Set up Custom Domain (Optional)
```bash
# Reserve a static IP
gcloud compute addresses create migracle-ip --global

# Create a load balancer pointing to your bucket
gcloud compute backend-buckets create migracle-backend-bucket \
  --gcs-bucket-name=migracle-gcp-2-website

# Create URL map
gcloud compute url-maps create migracle-url-map \
  --default-backend-bucket=migracle-backend-bucket

# Create HTTPS proxy
gcloud compute target-https-proxies create migracle-https-proxy \
  --url-map=migracle-url-map \
  --ssl-certificates=YOUR_SSL_CERT

# Create forwarding rule
gcloud compute forwarding-rules create migracle-https-rule \
  --address=migracle-ip \
  --global \
  --target-https-proxy=migracle-https-proxy \
  --ports=443
```

#### Set up Cloud CDN
```bash
# Enable CDN on the backend bucket
gcloud compute backend-buckets update migracle-backend-bucket \
  --enable-cdn
```

## Architecture Changes

### AWS → GCP Mapping
- **AWS Lambda** → **Cloud Functions**
- **DynamoDB** → **Firestore**
- **API Gateway** → **HTTP triggers on Cloud Functions**
- **S3 + CloudFront** → **Cloud Storage + Load Balancer/CDN**

### File Structure
```
migracle-serverless/
├── gcp-functions/
│   ├── contact-handler/
│   │   ├── index.js        # GCP Cloud Function
│   │   └── package.json
│   └── subscribe-handler/
│       ├── index.js        # GCP Cloud Function
│       └── package.json
├── deploy-gcp.sh           # Deployment script
└── frontend/               # Unchanged
```

## Key Differences

### 1. Database
- **AWS DynamoDB**: NoSQL with JSON documents
- **GCP Firestore**: NoSQL with document collections
- **Migration**: Data structure remains the same, but API calls changed

### 2. Functions
- **AWS Lambda**: Event-driven with API Gateway
- **GCP Cloud Functions**: HTTP-triggered functions
- **Migration**: Function logic similar, but different request/response handling

### 3. Static Hosting
- **AWS**: S3 bucket with CloudFront distribution
- **GCP**: Cloud Storage bucket with optional Load Balancer/CDN

## Testing

### Test Contact Function
```bash
curl -X POST https://us-central1-migracle-gcp-2.cloudfunctions.net/contactHandler \
  -H 'Content-Type: application/json' \
  -d '{"name":"Test User","email":"test@example.com","message":"Hello World"}'
```

### Test Subscribe Function
```bash
curl -X POST https://us-central1-migracle-gcp-2.cloudfunctions.net/subscribeHandler \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com"}'
```

## Cost Optimization

### GCP Pricing Benefits
- **Cloud Functions**: Pay per request (similar to Lambda)
- **Firestore**: Pay per read/write operation
- **Cloud Storage**: Lower egress costs than S3
- **No API Gateway**: Direct HTTP triggers reduce costs

### Estimated Monthly Costs (1000 users)
- Cloud Functions: ~$0.50
- Firestore: ~$2.00
- Cloud Storage: ~$1.00
- **Total**: ~$3.50/month (vs ~$8/month on AWS)

## Monitoring & Logging

### View Logs
```bash
# Function logs
gcloud functions logs read contactHandler --region=us-central1
gcloud functions logs read subscribeHandler --region=us-central1

# Real-time logs
gcloud functions logs tail contactHandler --region=us-central1
```

### Monitoring Dashboard
- Go to GCP Console → Cloud Functions
- Click on function name → View logs/metrics
- Set up alerts for errors/performance

## Troubleshooting

### Common Issues
1. **CORS errors**: Check function CORS headers
2. **Permission errors**: Ensure functions have Firestore access
3. **API endpoint not found**: Verify function deployment and URLs

### Debug Commands
```bash
# Check function status
gcloud functions describe contactHandler --region=us-central1

# Check Firestore collections
gcloud firestore export gs://migracle-gcp-2-backup/

# Check bucket permissions
gsutil iam get gs://migracle-gcp-2-website/
```