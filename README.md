# Migracle Serverless on GCP

A serverless website for Migracle built on Google Cloud Platform using modern serverless technologies.

## 🏗️ Architecture

The application uses the following GCP services:

- **Cloud Storage**: Static website hosting with public access
- **Cloud CDN**: Global content delivery network
- **Cloud Functions**: Serverless backend functions (Node.js)
- **Firestore**: NoSQL database for storing form data
- **Cloud Load Balancer**: HTTPS termination and custom domain support

## 📁 Project Structure

```
migracle-serverless/
├── gcp-functions/             # Cloud Functions
│   ├── contact-handler/       # Contact form handler
│   └── subscribe-handler/     # Email subscription handler
├── frontend/                  # Frontend code
│   ├── src/                   # React source code
│   │   ├── components/        # React components
│   │   └── index.js           # Main React entry point
│   ├── assets/                # Images and static files
│   ├── index.html             # Main HTML file
│   ├── styles.css             # CSS styles
│   ├── package.json           # Frontend dependencies
│   └── webpack.config.js      # Webpack configuration
├── deploy-gcp.sh              # Automated deployment script
├── namecheap-dns-setup.md     # Domain setup instructions
├── LOCAL_TESTING.md           # Local development guide
└── COST_ESTIMATION.md         # GCP cost analysis
```

## ✨ Features

- **React Frontend**: Modern component-based UI with Tailwind CSS
- **Serverless API**: HTTP-triggered Cloud Functions
- **NoSQL Database**: Firestore for contact forms and subscriptions
- **Custom Domain**: SSL-enabled domain support with Load Balancer
- **CDN**: Global content delivery for fast loading
- **Cost-Efficient**: Pay-per-use serverless pricing
- **Auto-Scaling**: Handles traffic spikes automatically
- **Zero Maintenance**: No server management required

## 🚀 Quick Deployment

### Prerequisites
- GCP account with billing enabled
- `gcloud` CLI installed and authenticated
- Node.js and npm for local development

### Deploy to GCP
```bash
# Make deployment script executable
chmod +x deploy-gcp.sh

# Run automated deployment
./deploy-gcp.sh
```

The script will:
1. Enable required GCP APIs
2. Set up Firestore database
3. Deploy Cloud Functions for contact/subscribe
4. Create Cloud Storage bucket for static hosting
5. Build and upload frontend
6. Configure load balancer with SSL

## 🌐 Custom Domain Setup

To use your own domain (e.g., `migracle.com`):

1. The deployment script creates the infrastructure
2. Update your DNS records as shown in `namecheap-dns-setup.md`
3. SSL certificates are automatically provisioned

See [namecheap-dns-setup.md](./namecheap-dns-setup.md) for detailed DNS configuration.

## 🔧 Local Development

See [LOCAL_TESTING.md](./LOCAL_TESTING.md) for instructions on:
- Running the frontend locally
- Testing Cloud Functions locally
- Using the GCP emulator suite

## 💰 Cost Analysis

See [COST_ESTIMATION.md](./COST_ESTIMATION.md) for detailed cost breakdown. 

**Estimated monthly cost for 1000 users**: ~$3-5/month

## 🔗 Live URLs

After deployment, your application will be available at:

- **Cloud Storage**: `https://storage.googleapis.com/[PROJECT-ID]-website/index.html`
- **Custom Domain**: `https://your-domain.com` (after DNS setup)
- **Contact API**: `https://[REGION]-[PROJECT-ID].cloudfunctions.net/contactHandler`
- **Subscribe API**: `https://[REGION]-[PROJECT-ID].cloudfunctions.net/subscribeHandler`

## 📧 API Endpoints

### Contact Form
```bash
POST https://us-central1-[PROJECT-ID].cloudfunctions.net/contactHandler
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello from Migracle!"
}
```

### Email Subscription
```bash
POST https://us-central1-[PROJECT-ID].cloudfunctions.net/subscribeHandler
Content-Type: application/json

{
  "email": "john@example.com"
}
```

## 🛠️ Technology Stack

- **Frontend**: React 19, Tailwind CSS, Webpack
- **Backend**: Node.js Cloud Functions
- **Database**: Google Firestore
- **Hosting**: Cloud Storage + Cloud CDN
- **Domain**: Cloud Load Balancer with SSL

## 📝 Environment Variables

The Cloud Functions automatically use:
- `REGION`: Deployment region (default: us-central1)
- `GOOGLE_CLOUD_PROJECT`: Your GCP project ID

## 🔒 Security

- CORS properly configured for frontend access
- Input validation on all API endpoints
- Firestore security rules prevent unauthorized access
- SSL/HTTPS enforced on all endpoints

## 📞 Support

For issues with:
- **GCP Services**: Check Cloud Console logs
- **Domain Setup**: See DNS troubleshooting in setup guide
- **Local Development**: Refer to LOCAL_TESTING.md

---

Built with ❤️ using Google Cloud Platform serverless technologies.