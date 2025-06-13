# Local Testing Guide for Migracle Serverless

This guide explains how to test your serverless application locally before deploying it to GCP.

## Method 1: Using Google Cloud Functions Framework

### Prerequisites

- Node.js 18 or later
- npm or yarn package manager
- Google Cloud CLI (gcloud) installed

### Install Functions Framework

```bash
npm install -g @google-cloud/functions-framework
```

### Testing Cloud Functions Locally

#### 1. Test Contact Handler

```bash
cd gcp-functions/contact-handler
npm install

# Start the function locally on port 8080
npx @google-cloud/functions-framework --target=contactHandler --port=8080
```

The function will be available at `http://localhost:8080`

Test with curl:
```bash
curl -X POST http://localhost:8080 \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Hello World"}'
```

#### 2. Test Subscribe Handler

In a new terminal:
```bash
cd gcp-functions/subscribe-handler
npm install

# Start the function locally on port 8081
npx @google-cloud/functions-framework --target=subscribeHandler --port=8081
```

Test with curl:
```bash
curl -X POST http://localhost:8081 \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### Testing with Local Firestore Emulator

For complete local testing with database:

#### 1. Install Firebase CLI
```bash
npm install -g firebase-tools
```

#### 2. Initialize Firestore Emulator
```bash
firebase init emulators
# Select Firestore when prompted
# Set port to 8088 for Firestore
```

#### 3. Start Firestore Emulator
```bash
firebase emulators:start --only firestore
```

#### 4. Update Cloud Functions for Local Testing
Set environment variable to use local Firestore:
```bash
export FIRESTORE_EMULATOR_HOST=localhost:8088
```

Then start your functions as described above.

## Method 2: Testing Frontend Locally

### Prerequisites
- Node.js and npm
- Webpack installed

### Start Frontend Development Server

```bash
cd frontend
npm install
npm run dev  # Starts webpack in watch mode
```

### Serve Frontend Files
For serving the frontend, you can use any static file server:

```bash
# Using Python (if installed)
python3 -m http.server 8000

# Using Node.js http-server (install first: npm install -g http-server)
http-server . -p 8000

# Using PHP (if installed)
php -S localhost:8000
```

Visit `http://localhost:8000` to view the frontend.

## Method 3: Full Local Development Setup

### 1. Create Local Development Script

Create `local-dev.js`:

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static files from frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// Mock contact endpoint
app.post('/api/contact', (req, res) => {
  console.log('Contact form submission:', req.body);
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  
  res.json({ 
    message: 'Contact form submitted successfully (local)',
    id: 'local-' + Date.now()
  });
});

// Mock subscribe endpoint
app.post('/api/subscribe', (req, res) => {
  console.log('Subscription:', req.body);
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  res.json({ 
    message: 'Subscription successful (local)',
    email 
  });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Local server running at http://localhost:${PORT}`);
  console.log(`📝 Contact API: http://localhost:${PORT}/api/contact`);
  console.log(`📧 Subscribe API: http://localhost:${PORT}/api/subscribe`);
});
```

### 2. Install Dependencies
```bash
npm init -y
npm install express cors
```

### 3. Update Frontend for Local Development

Temporarily update `frontend/index.html` to use local endpoints:

```html
<script>
  // Use local development endpoints
  window.API_ENDPOINT = 'http://localhost:3000';
</script>
```

### 4. Run Local Development Server
```bash
node local-dev.js
```

Visit `http://localhost:3000` to test the complete application locally.

## Environment Variables

### Local Environment Variables
Create a `.env` file for local development:

```bash
# .env (for local development only)
GOOGLE_CLOUD_PROJECT=your-project-id
FIRESTORE_EMULATOR_HOST=localhost:8088
GCLOUD_PROJECT=your-project-id
```

Load with:
```bash
source .env
# or use dotenv package
```

## Testing Checklist

- [ ] Contact form submission works
- [ ] Email subscription works  
- [ ] Frontend loads without errors
- [ ] API endpoints respond correctly
- [ ] CORS headers are properly set
- [ ] Data validation works on both frontend and backend
- [ ] Error handling works properly

## Troubleshooting

### Common Issues

1. **Port conflicts**: Use different ports if 8080/8081 are in use
2. **CORS errors**: Ensure CORS is enabled in your local functions
3. **Module not found**: Run `npm install` in function directories
4. **Firestore connection**: Check emulator is running and environment variables are set

### Debug Commands

```bash
# Check if functions framework is installed
npm list -g @google-cloud/functions-framework

# Check if Firebase CLI is installed
firebase --version

# Check running processes on ports
lsof -i :8080
lsof -i :8081
```

## Next Steps

Once local testing is complete:
1. Build frontend for production: `npm run build`
2. Deploy to GCP using: `./deploy-gcp.sh`
3. Test deployed functions with real URLs