#!/bin/bash

# This script helps configure the Vercel environment for deployment
# Run this script after installing the Vercel CLI with 'npm i -g vercel'

echo "Setting up Vercel deployment configuration"

# Prompt for Backblaze B2 bucket URL
read -p "Enter your Backblaze B2 bucket URL (e.g., https://your-bucket.s3.us-west-000.backblazeb2.com): " B2_URL

# Set environment variables
echo "Setting environment variables for Vercel project"
vercel env add NEXT_PUBLIC_MEDIA_URL production "$B2_URL"

# Link project to Vercel if not already linked
if [ ! -f ".vercel/project.json" ]; then
    echo "Linking project to Vercel"
    vercel link
fi

echo ""
echo "Setup complete! Now you can deploy your site to Vercel with:"
echo "vercel --prod"
echo ""
echo "Don't forget to upload your media files to Backblaze B2 with the same directory structure as your public folder."
