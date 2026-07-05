# GCP Serverless Cost Estimation

This document provides an estimated cost breakdown for running the Migracle serverless application on Google Cloud Platform. These estimates are based on typical usage patterns and GCP pricing as of 2025.

## Assumptions

- **Website Traffic**: 1,000 unique visitors per month
- **Form Submissions**: 50 contact form submissions per month
- **Subscriptions**: 30 new subscriptions per month
- **Region**: us-central1 (Iowa)
- **Data Transfer**: 2GB per month outbound

## Cost Breakdown

### Cloud Storage
- **Storage**: ~10MB for website files
  - Standard Storage: $0.020 per GB per month
  - Estimated cost: < $0.01 per month

- **Operations**: 
  - Class A operations (uploads): ~10 per month = $0.005
  - Class B operations (downloads): ~2,000 per month = $0.004
  - Total operations: ~$0.01 per month

### Cloud Functions

#### Contact Handler Function
- **Invocations**: 50 per month
- **Memory**: 256MB allocated
- **Runtime**: ~200ms average per request
- **Compute time**: 50 × 0.2 seconds = 10 seconds
- **Cost**: 
  - First 2 million invocations free
  - Compute time: 10 seconds × $0.0000025 = < $0.01
  - **Monthly cost**: < $0.01

#### Subscribe Handler Function  
- **Invocations**: 30 per month
- **Memory**: 256MB allocated
- **Runtime**: ~100ms average per request
- **Compute time**: 30 × 0.1 seconds = 3 seconds
- **Cost**:
  - First 2 million invocations free
  - Compute time: 3 seconds × $0.0000025 = < $0.01
  - **Monthly cost**: < $0.01

### Firestore Database
- **Document reads**: ~100 per month (form submissions + lookups)
  - First 50,000 reads per day are free
  - **Cost**: $0.00

- **Document writes**: ~80 per month (contact forms + subscriptions)
  - First 20,000 writes per day are free
  - **Cost**: $0.00

- **Storage**: ~1MB for form data
  - First 1GB free
  - **Cost**: $0.00

### Cloud Load Balancer (for custom domain)
- **Forwarding rules**: 1 global rule
  - Cost: $18.00 per month for the first 5 rules
  - **Monthly cost**: $18.00

- **Data processing**: 2GB outbound per month
  - First 1GB per month free
  - Additional 1GB: $0.008 per GB
  - **Monthly cost**: $0.008

### Cloud CDN (optional, included with Load Balancer)
- **Cache egress**: 2GB per month
  - First 10GB per month free
  - **Monthly cost**: $0.00

### SSL Certificate
- **Google-managed SSL**: Free
- **Monthly cost**: $0.00

## Total Monthly Cost Estimate

| Service | Monthly Cost |
|---------|-------------|
| Cloud Storage | $0.02 |
| Cloud Functions | $0.02 |
| Firestore | $0.00 |
| Load Balancer | $18.01 |
| CDN | $0.00 |
| SSL Certificate | $0.00 |
| **TOTAL** | **~$18.05** |

## Cost Optimization Options

### Option 1: Without Custom Domain
If you don't need a custom domain and can use the direct Cloud Storage URL:

| Service | Monthly Cost |
|---------|-------------|
| Cloud Storage | $0.02 |
| Cloud Functions | $0.02 |
| Firestore | $0.00 |
| **TOTAL** | **~$0.04** |

### Option 2: Using Cloud Run instead of Load Balancer
For lower traffic, you could serve the frontend from Cloud Run:

| Service | Monthly Cost |
|---------|-------------|
| Cloud Run (frontend) | $0.00* |
| Cloud Functions | $0.02 |
| Firestore | $0.00 |
| **TOTAL** | **~$0.02** |

*Cloud Run has a generous free tier

## Scaling Considerations

### At 10,000 visitors/month:
- Cloud Storage: ~$0.20
- Cloud Functions: ~$0.10  
- Firestore: ~$0.00 (still within free tier)
- Load Balancer: $18.08
- **Total**: ~$18.38

### At 100,000 visitors/month:
- Cloud Storage: ~$2.00
- Cloud Functions: ~$1.00
- Firestore: ~$0.50
- Load Balancer: $18.80
- **Total**: ~$22.30

## Cost Comparison with Other Platforms

| Platform | Monthly Cost (1K visitors) |
|----------|----------------------------|
| **GCP (with domain)** | **$18.05** |
| **GCP (no domain)** | **$0.04** |
| AWS Serverless | ~$25.00 |
| Vercel Pro | $20.00 |
| Netlify Pro | $19.00 |
| Traditional VPS | $20-50 |

## Free Tier Benefits

GCP provides generous free tiers that cover:
- First 2M Cloud Function invocations per month
- First 50K Firestore reads per day
- First 20K Firestore writes per day  
- First 1GB Cloud Storage
- First 1GB CDN egress

Most small to medium websites will operate entirely within the free tier limits.

## Monitoring Costs

To monitor your actual costs:

1. **Cloud Console**: Visit Cloud Billing in GCP Console
2. **Budgets**: Set up budget alerts
3. **Cost breakdown**: View by service
4. **Recommendations**: GCP provides cost optimization suggestions

## Cost Control Strategies

1. **Use Cloud Storage directly** instead of Load Balancer for simple sites
2. **Monitor function execution time** - optimize for faster execution
3. **Implement caching** to reduce function calls
4. **Use CDN caching** to reduce origin requests
5. **Set billing alerts** to avoid unexpected charges

## Regional Pricing

Costs may vary by region. `us-central1` typically offers the best pricing for most services. Consider latency vs. cost when choosing regions.

---

**Note**: All prices are estimates based on current GCP pricing and may change. Actual costs may vary based on usage patterns, regional pricing differences, and promotional credits. Check the current GCP pricing calculator for the most up-to-date pricing.