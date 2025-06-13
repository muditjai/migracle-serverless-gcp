# AWS Serverless Cost Estimation

This document provides an estimated cost breakdown for running the Migracle serverless application on AWS. These estimates are based on typical usage patterns and AWS pricing as of April 2025.

## Assumptions

- **Website Traffic**: 1,000 unique visitors per month
- **Form Submissions**: 50 contact form submissions per month
- **Subscriptions**: 30 new subscriptions per month
- **Region**: us-west-2 (Oregon)
- **Data Transfer**: 2GB per month

## Cost Breakdown

### S3 (Simple Storage Service)

- **Storage**: ~10MB for website files
  - First 50TB: $0.023 per GB
  - Estimated cost: < $0.01 per month

- **Requests**:
  - PUT/COPY/POST/LIST: 100 requests per month (for updates) at $0.005 per 1,000 requests
  - GET: 5,000 requests per month at $0.0004 per 1,000 requests
  - Estimated cost: < $0.01 per month

### CloudFront

- **Data Transfer Out**: 2GB per month
  - First 10TB: $0.085 per GB
  - Estimated cost: $0.17 per month

- **HTTP/HTTPS Requests**: 5,000 requests per month
  - $0.0075 per 10,000 HTTPS requests
  - Estimated cost: < $0.01 per month

### API Gateway

- **API Calls**: 80 calls per month (50 contact + 30 subscription)
  - $3.50 per million API calls
  - Estimated cost: < $0.01 per month

### Lambda

- **Invocations**: 80 invocations per month
  - Free tier: First 1 million requests per month are free
  - Estimated cost: $0.00 per month

- **Compute Time**:
  - Assuming 500ms average execution time with 128MB memory
  - Free tier: 400,000 GB-seconds per month
  - Estimated cost: $0.00 per month (within free tier)

### DynamoDB

- **Storage**: < 1GB
  - $0.25 per GB
  - Estimated cost: < $0.25 per month

- **Read/Write Capacity**:
  - On-demand pricing
  - Estimated 80 write request units per month
  - Estimated 20 read request units per month
  - $1.25 per million write request units
  - $0.25 per million read request units
  - Estimated cost: < $0.01 per month (within free tier)

### CloudWatch (Logs and Monitoring)

- **Log Storage**: ~10MB per month
  - $0.50 per GB ingested
  - $0.03 per GB archived
  - Estimated cost: < $0.01 per month

- **Alarms**: None configured by default
  - Estimated cost: $0.00 per month

## Total Estimated Monthly Cost

| Service     | Estimated Cost |
|-------------|----------------|
| S3          | < $0.01        |
| CloudFront  | $0.17          |
| API Gateway | < $0.01        |
| Lambda      | $0.00          |
| DynamoDB    | < $0.25        |
| CloudWatch  | < $0.01        |
| **Total**   | **< $0.45**    |

## Free Tier Considerations

If you're within the AWS Free Tier period (12 months from account creation), many of these services would be free or have significantly reduced costs:

- **S3**: 5GB of storage, 20,000 GET requests, 2,000 PUT requests
- **CloudFront**: 50GB data transfer out and 2,000,000 HTTP/HTTPS requests
- **API Gateway**: 1 million API calls
- **Lambda**: 1 million free requests per month and 400,000 GB-seconds of compute time
- **DynamoDB**: 25GB of storage, 25 write capacity units, 25 read capacity units

With the Free Tier, the total monthly cost would likely be **$0.00** for the first 12 months.

## Cost Optimization Tips

1. **Use CloudFront caching effectively** to reduce origin requests to S3
2. **Implement proper TTLs** for CloudFront cache to reduce the number of API calls
3. **Optimize Lambda functions** to reduce execution time and memory usage
4. **Monitor usage patterns** and adjust resources accordingly
5. **Set up AWS Budgets** to get alerts if costs exceed expected thresholds

## Scaling Considerations

As your application grows, costs will scale primarily with:

1. **Traffic volume**: Affecting CloudFront and S3 costs
2. **Form submissions**: Affecting API Gateway, Lambda, and DynamoDB costs
3. **Data storage**: Affecting DynamoDB and S3 costs

At significantly higher volumes (e.g., 100,000+ monthly visitors), you may want to revisit this cost estimation.

---

**Note**: These estimates are approximations and actual costs may vary based on usage patterns, AWS pricing changes, and other factors. Always monitor your AWS billing dashboard for actual costs.
