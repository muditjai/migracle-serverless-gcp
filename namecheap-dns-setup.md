# Namecheap DNS Setup for migracle.com

## 🎯 Quick Setup Guide

Your GCP infrastructure is ready! Now you need to update DNS records in Namecheap to point your domain to GCP.

### ✅ GCP Infrastructure Ready:
- **Static IP**: `34.8.48.9`
- **Load Balancer**: Configured with SSL certificate
- **CDN**: Enabled for fast global delivery
- **SSL Certificate**: Google-managed SSL for HTTPS

## 📋 Namecheap DNS Configuration

### Step 1: Login to Namecheap
1. Go to [namecheap.com](https://namecheap.com)
2. Login to your account
3. Go to **Domain List** → Click **Manage** next to `migracle.com`

### Step 2: Update DNS Records
1. Click on **Advanced DNS** tab
2. **Delete existing A records** (if any)
3. **Add these new A records**:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | @ | `34.8.48.9` | Automatic |
| A Record | www | `34.8.48.9` | Automatic |

### Step 3: Optional CNAME (Alternative to www A record)
Instead of the www A record above, you can use:
| Type | Host | Value | TTL |
|------|------|-------|-----|
| CNAME Record | www | migracle.com | Automatic |

### Step 4: Save Changes
1. Click **Save All Changes**
2. Wait for DNS propagation (5-30 minutes)

## ⏱️ Timeline
- **DNS Propagation**: 5-30 minutes
- **SSL Certificate Provisioning**: 15-60 minutes (happens automatically)
- **Full Availability**: Within 1 hour

## 🔍 Verification Steps

### After DNS Changes:
1. **Check DNS propagation**:
   ```bash
   nslookup migracle.com
   nslookup www.migracle.com
   ```
   
2. **Test website access**:
   - http://migracle.com (should work immediately)
   - https://migracle.com (available after SSL provisioning)
   - https://www.migracle.com (available after SSL provisioning)

### SSL Certificate Status:
```bash
gcloud compute ssl-certificates describe migracle-ssl-cert --global
```

## 🔧 Troubleshooting

### DNS Not Propagating?
- Wait up to 48 hours for full global propagation
- Use online DNS checkers: [whatsmydns.net](https://whatsmydns.net)
- Clear browser cache and try incognito mode

### SSL Certificate Issues?
- SSL certificates can take up to 60 minutes to provision
- Ensure DNS is pointing to the correct IP before SSL provisioning completes
- Check certificate status with the gcloud command above

### Website Not Loading?
1. Verify DNS records point to `34.8.48.9`
2. Try accessing the direct GCP storage URL first
3. Check browser console for any errors

## 📞 Support
If you encounter issues:
1. Check DNS propagation status
2. Verify GCP load balancer health
3. Contact Namecheap support for DNS-specific issues

## 🎉 Success!
Once complete, your website will be available at:
- **https://migracle.com** ✅
- **https://www.migracle.com** ✅
- **Fast global CDN delivery** ✅
- **Automatic HTTPS/SSL** ✅