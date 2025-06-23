# Cloudflare CDN Setup for Backblaze B2

This guide follows the official Backblaze documentation for setting up Cloudflare as a CDN for your B2 bucket.

## Step 1: Create Public Backblaze B2 Bucket

1. **Create a Public Bucket**
   - In B2 dashboard: Buckets → Create a Bucket
   - Choose a globally unique name (6+ characters)
   - Set privacy to **Public**
   - Upload a test file and note the "Friendly URL"
   - Note your B2 endpoint (e.g., `f000.backblazeb2.com`)

2. **Configure Caching Headers**
   - Go to your bucket settings
   - In "Bucket Info" field, enter: `{"cache-control":"max-age=7200"}`
   - Click "Update Bucket"

## Step 2: Configure Cloudflare DNS

1. **Add Domain to Cloudflare**
   - Ensure Cloudflare is your domain nameserver

2. **Create CNAME Record**
   - DNS → Records → Add record
   - Type: CNAME
   - Name: `cdn` (or your preferred subdomain)
   - Target: `f004.backblazeb2.com` (your B2 endpoint)
   - Proxy status: ✅ Proxied (orange cloud)

## Step 3: Create Transform Rules (CRITICAL)

1. **Rewrite Rule**
   - Rules → Transform Rules → Create Rule
   - Rule name: "Rewrite path for ethan-site-media"
   - Custom filter expression:
     - Field: Hostname
     - Operator: equals
     - Value: `cdn.yourdomain.com` (replace with your actual domain)
   - Set Rewrite parameters:
     - Path → Rewrite to... → Dynamic
     - Value: `concat("/file/ethan-site-media", http.request.uri.path)`
   - Click Deploy

## Step 4: Configure Page Rules

1. **Cache Rule**
   - Page Rules → Create Page Rule
   - URL: `https://cdn.yourdomain.com/file/ethan-site-media/*`
   - Settings: Cache Level → Standard

2. **Security Rule (Optional)**
   - URL: `https://cdn.yourdomain.com/file/*/*`
   - Forwarding URL: 302 redirect to `https://secure.backblaze.com/404notfound`
   - Ensure cache rule is ABOVE this rule

## Step 5: Update Site Configuration

Update your `.env.local`:
```
# Your complete CDN URL including bucket path
NEXT_PUBLIC_MEDIA_URL=https://cdn.yourdomain.com/file/ethan-site-media
```

## Step 6: Test Setup

1. **Your files are already uploaded!** ✅
2. **Test CDN access**: `https://cdn.yourdomain.com/file/ethan-site-media/images/photographs/camogli/1.jpg`
3. **Check headers**: Look for `cf-cache-status: HIT` after a few requests
4. **Compare with direct B2**: `https://f004.backblazeb2.com/file/ethan-site-media/images/photographs/camogli/1.jpg`

## Important Notes

- ⚠️ **Must use HTTPS** - HTTP won't work
- 🔄 **Transform rules are required** - Without them, anyone can access other buckets via your domain
- 📦 **Include /file/bucket-name** in your NEXT_PUBLIC_MEDIA_URL
- ⏱️ **Caching takes a few requests** - First request will be MISS, subsequent ones HIT

## Benefits

- 🆓 **No egress fees** between Backblaze and Cloudflare
- ⚡ **Global CDN** performance
- 🛡️ **DDoS protection**
- 💰 **Cost effective** storage + delivery