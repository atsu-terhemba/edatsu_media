# Cloudflare R2 CORS Configuration Guide

## Problem
Images fail to load from R2 with CORS errors. Browsers block cross-origin requests when proper CORS headers aren't configured.

## Solution: Configure CORS on R2 Bucket

### Method 1: Using Cloudflare Dashboard (Recommended)

1. **Login to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Navigate to R2 Object Storage

2. **Select Your Bucket**
   - Click on `edatsu-media-storage-object`

3. **Configure CORS Settings**
   - Click on "Settings" tab
   - Scroll to "CORS Policy" section
   - Click "Add CORS Policy" or "Edit"

4. **Add the following CORS configuration:**

```json
[
  {
    "AllowedOrigins": [
      "http://localhost",
      "http://localhost:5173",
      "https://edatsu.com",
      "https://www.edatsu.com",
      "https://media.edatsu.com"
    ],
    "AllowedMethods": [
      "GET",
      "HEAD",
      "PUT",
      "POST"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag",
      "Content-Length"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

5. **Save the Configuration**

---

### Method 2: Using Wrangler CLI

If you have Wrangler CLI installed:

```bash
# Install Wrangler if not installed
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create a CORS configuration file
# Save the JSON above to: r2-cors-config.json

# Apply CORS configuration
wrangler r2 bucket cors put edatsu-media-storage-object --config r2-cors-config.json
```

---

### Method 3: Using AWS S3 CLI (S3-Compatible)

Since R2 is S3-compatible, you can use AWS CLI:

```bash
# Install AWS CLI
# Configure with R2 credentials
aws configure --profile r2

# Create cors.json file with the configuration above

# Apply CORS
aws s3api put-bucket-cors \
  --bucket edatsu-media-storage-object \
  --cors-configuration file://cors.json \
  --endpoint-url https://7e0e4e82d2dee0ac243d665fb88e17fb.r2.cloudflarestorage.com \
  --profile r2
```

---

## Verification

### Test CORS Configuration

1. **Check CORS headers in browser:**
   - Open DevTools (F12)
   - Go to Network tab
   - Try loading an image from R2
   - Check response headers for:
     - `Access-Control-Allow-Origin`
     - `Access-Control-Allow-Methods`

2. **Test with curl:**
```bash
curl -I https://media.edatsu.com/uploads/prod/test.jpg \
  -H "Origin: http://localhost"
```

Expected headers:
```
Access-Control-Allow-Origin: http://localhost
Access-Control-Allow-Methods: GET, HEAD, PUT, POST
```

---

## Public Access Configuration

Additionally, ensure your R2 bucket allows public access for images:

1. **Enable Public Access**
   - In R2 bucket settings
   - Look for "Public Access" or "Bucket Access"
   - Enable public read access

2. **Custom Domain Configuration**
   - Your custom domain: `media.edatsu.com`
   - Ensure it's properly connected to R2 bucket
   - DNS CNAME should point to your R2 bucket URL

---

## Troubleshooting

### Images still not loading?

1. **Check bucket permissions:**
   - Ensure bucket has public read access enabled

2. **Verify custom domain:**
   - Test direct R2 URL: `https://pub-xxxxx.r2.dev/uploads/prod/test.jpg`
   - Compare with custom domain: `https://media.edatsu.com/uploads/prod/test.jpg`

3. **Check browser console:**
   - Look for specific CORS error messages
   - Verify the exact origin being blocked

4. **Clear browser cache:**
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)

5. **Test with different origins:**
   - If localhost works but production doesn't, add production domain to CORS config

---

## Important Notes

- **Development URLs**: Include `http://localhost` and `http://localhost:5173` for local development
- **Production URLs**: Update with your actual production domains
- **Wildcard Origins**: Using `"*"` allows all origins but is less secure
- **HTTPS**: Ensure production uses HTTPS for security
- **Cache**: Changes may take a few minutes to propagate

---

## Quick Fix CORS Configuration

If you want to quickly allow all origins (NOT recommended for production):

```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

**⚠️ Warning**: Only use this for testing. Always restrict origins in production.

---

## Contact

For more information on R2 CORS configuration:
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [CORS Configuration Guide](https://developers.cloudflare.com/r2/buckets/cors/)
