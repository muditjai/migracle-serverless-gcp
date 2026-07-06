# GCP Serverless Cost Estimation

This document provides an estimated cost breakdown for running the Migracle marketing site on Google Cloud Platform. These estimates are based on typical usage patterns and GCP pricing as of 2025.

> **Note**: This doc covers the cost of **hosting the marketing site itself**. Migracle's product is an outcome-based cloud cost-saving service for customers - see [`README.md`](./README.md) for the product description.

## Assumptions - **Website Traffic**: 1,000 unique visitors per month to the **prod** environment - **Form Submissions**: 50 contact form submissions per month - **Subscriptions**: 30 new subscriptions per month - **Region**: us-central1 (Iowa) - **Data Transfer**: 2GB per month outbound - **Environments**: One **prod** environment + one **test** environment on GCP Cloud Run - Test environment is used for owner review of every change before promotion to prod. - Test mirrors prod for parity but receives very little external traffic - its costs are dominated by the always-on Cloud Run instance, not by traffic.

## Cost Breakdown (prod environment)

### Cloud Storage - **Storage**: ~10MB for website files - Standard Storage: $0.020 per GB per month - Estimated cost: < $0.01 per month - **Operations**: - Class A operations (uploads): ~10 per month = $0.005 - Class B operations (downloads): ~2,000 per month = $0.004 - Total operations: ~$0.01 per month

### Cloud Functions

#### Contact Handler Function - **Invocations**: 50 per month - **Memory**: 256MB allocated - **Runtime**: ~200ms average per request - **Compute time**: 50 × 0.2 seconds = 10 seconds - **Cost**: - First 2 million invocations free - Compute time: 10 seconds × $0.0000025 = < $0.01 - **Monthly cost**: < $0.01

#### Subscribe Handler Function - **Invocations**: 30 per month - **Memory**: 256MB allocated - **Runtime**: ~100ms average per request - **Compute time**: 30 × 0.1 seconds = 3 seconds - **Cost**: - First 2 million invocations free - Compute time: 3 seconds × $0.0000025 = < $0.01 - **Monthly cost**: < $0.01

### Firestore Database - **Document reads**: ~100 per month (form submissions + lookups) - First 50,000 reads per day are free - **Cost**: $0.00 - **Document writes**: ~80 per month (contact forms + subscriptions) - First 20,000 writes per day are free - **Cost**: $0.00 - **Storage**: ~1MB for form data - First 1GB free - **Cost**: $0.00

### Cloud Load Balancer (for custom domain) - **Forwarding rules**: 1 global rule - Cost: $18.00 per month for the first 5 rules - **Monthly cost**: $18.00 - **Data processing**: 2GB outbound per month - First 1GB per month free - Additional 1GB: $0.008 per GB - **Monthly cost**: $0.008

### Cloud CDN (optional, included with Load Balancer) - **Cache egress**: 2GB per month - First 10GB per month free - **Monthly cost**: $0.00

### SSL Certificate - **Google-managed SSL**: Free - **Monthly cost**: $0.00

## Test Environment Cost

The **test** Cloud Run container is provisioned to mirror prod so changes can be vetted end-to-end before promotion. Costs:

| Service | Monthly Cost (test) | Notes |
|---------|---------------------|-------|
| Cloud Run (test container, min-instances for parity) | ~$0.00 - $5.00 | Scales to zero when idle; enable min-instance only if cold starts matter |
| Cloud Storage (test bucket, if separate) | ~$0.02 | Same as prod |
| Cloud Functions (test- prefix) | < $0.01 | Very low traffic |
| Cloud Load Balancer (test, if separate) | $0.00 or $18.00 | **Re-use the prod load balancer** with host/path routing if possible; charge only applies to a dedicated LB |
| **TEST TOTAL (typical)** | **~$0.05 - $5.00** | Dominated by Cloud Run min-instance decisions |

**Recommendation**: Keep the test load balancer optional. Use Cloud Run's built-in URL (`https://<service>-<hash>-uc.a.run.app`) for owner review and only attach a custom domain / LB when the test needs to be fully prod-shaped.

## Total Monthly Cost Estimate

### Prod only
| Service | Monthly Cost |
|---------|-------------|
| Cloud Storage | $0.02 |
| Cloud Functions | $0.02 |
| Firestore | $0.00 |
| Load Balancer | $18.01 |
| CDN | $0.00 |
| SSL Certificate | $0.00 |
| **TOTAL (prod)** | **~$18.05** |

### Prod + Test (typical)
| Service | Monthly Cost |
|---------|-------------|
| Prod stack (above) | $18.05 |
| Test Cloud Run container | $0.00 - $5.00 |
| Test bucket / fns | $0.05 |
| **TOTAL (prod + test)** | **~$18.10 - $23.10** |

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

### At 10,000 visitors/month (prod only): - Cloud Storage: ~$0.20 - Cloud Functions: ~$0.10 - Firestore: ~$0.00 (still within free tier) - Load Balancer: $18.08 - **Total**: ~$18.38

### At 100,000 visitors/month (prod only): - Cloud Storage: ~$2.00 - Cloud Functions: ~$1.00 - Firestore: ~$0.50 - Load Balancer: $18.80 - **Total**: ~$22.30

## Cost Comparison with Other Platforms

| Platform | Monthly Cost (1K visitors) |
|----------|----------------------------|
| **GCP (prod, with domain)** | **$18.05** |
| **GCP (prod + test, with domain)** | **$18.10 - $23.10** |
| **GCP (no domain)** | **$0.04** |
| AWS Serverless | ~$25.00 |
| Vercel Pro | $20.00 |
| Netlify Pro | $19.00 |
| Traditional VPS | $20-50 |

## Free Tier Benefits

GCP provides generous free tiers that cover: - First 2M Cloud Function invocations per month - First 50K Firestore reads per day - First 20K Firestore writes per day - First 1GB Cloud Storage - First 1GB CDN egress

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
6. **Keep test environment lean** - let the test Cloud Run service scale to zero between reviews, and don't attach a dedicated load balancer to it unless you need external HTTPS

## Regional Pricing

Costs may vary by region. `us-central1` typically offers the best pricing for most services. Consider latency vs. cost when choosing regions.

---

**Note**: All prices are estimates based on current GCP pricing and may change. Actual costs may vary based on usage patterns, regional pricing differences, and promotional credits. Check the current GCP pricing calculator for the most up-to-date pricing.