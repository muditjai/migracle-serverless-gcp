# Migracle - Cloud Expansion Services for ISVs

Website for Migracle, a company that helps Enterprise Software Vendors (ISVs) expand to new cloud regions and providers in 4-6 weeks instead of 2-3 quarters.

**Live site**: https://migracle.com

## Architecture

Built on Google Cloud Platform using serverless technologies:

- **Cloud Storage**: Static website hosting
- **Cloud Functions**: Serverless backend (Node.js 22)
- **Firestore**: NoSQL database for leads
- **Cloud Load Balancer**: HTTPS and custom domain

## Project Structure

```
migracle-serverless/
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── index.js           # React entry point
│   │   └── tailwind.css       # Tailwind input
│   ├── dist/                  # Built assets
│   ├── assets/                # Images
│   ├── index.html
│   ├── styles.css
│   ├── tailwind.config.js
│   ├── webpack.config.js
│   └── package.json
├── gcp-functions/
│   ├── contact-handler/       # Contact form API
│   └── subscribe-handler/     # Subscription API
├── deploy-gcp.sh              # Deployment script
└── spec/                      # All project documentation (this folder)
    ├── README.md              #   ← You are here (GitHub renders this)
    ├── AGENTS.md              # Agent-facing instructions
    ├── CODING_STANDARDS.md    # Style and conventions
    ├── ARCHITECTURE.md        # System architecture details
    ├── COST_ESTIMATION.md     # GCP cost breakdown
    └── DNS_SETUP.md           # Namecheap DNS configuration
```

## Tech Stack

- **Frontend**: React 19, Tailwind CSS 3, Webpack
- **Backend**: Node.js 22 Cloud Functions
- **Database**: Firestore (single `leads` collection)
- **Email**: Zoho SMTP via Nodemailer

## Documentation

All project documentation lives in the [`spec/`](./spec/) folder:

- [`spec/README.md`](./spec/README.md) – This file (project overview)
- [`spec/AGENTS.md`](./spec/AGENTS.md) – Instructions for AI coding agents
- [`spec/CODING_STANDARDS.md`](./spec/CODING_STANDARDS.md) – Code style and conventions
- [`spec/ARCHITECTURE.md`](./spec/ARCHITECTURE.md) – Detailed system architecture
- [`spec/COST_ESTIMATION.md`](./spec/COST_ESTIMATION.md) – GCP cost breakdown
- [`spec/DNS_SETUP.md`](./spec/DNS_SETUP.md) – Namecheap DNS configuration

## Deployment

### Prerequisites
- GCP account with billing enabled
- `gcloud` CLI installed and authenticated

### Quick Deploy

```bash
# Frontend only
./deploy-gcp.sh frontend

# Full deployment (functions + frontend)
./deploy-gcp.sh
```

### Environment Variables

Cloud Functions require:
- `EMAIL_USER`: Zoho email address
- `EMAIL_PASS`: Zoho app password

Set via:
```bash
gcloud functions deploy contactHandler --region=us-central1 \
  --update-env-vars EMAIL_USER=your-email,EMAIL_PASS=your-password
```

## API Endpoints

### Contact Form
```bash
POST https://us-central1-migracle-gcp-2.cloudfunctions.net/contactHandler
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Optional message"  # message is optional
}
```

### Email Subscription
```bash
POST https://us-central1-migracle-gcp-2.cloudfunctions.net/subscribeHandler
Content-Type: application/json

{
  "email": "john@example.com"
}
```

Both endpoints:
- Store data in `leads` collection with `source` field (`contact_form` or `subscription_form`)
- Send email notification to mudit@migracle.com

## Local Development

```bash
cd frontend
npm install
npm run build      # Build CSS and JS
python3 -m http.server 3000   # Serve locally
```

## DNS Setup

See [`spec/DNS_SETUP.md`](./spec/DNS_SETUP.md) for domain configuration.