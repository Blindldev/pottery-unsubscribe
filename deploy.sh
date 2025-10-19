#!/bin/bash

# GitHub Pages Deployment Script for Pottery Unsubscribe System
# This script helps you deploy the unsubscribe page to GitHub Pages

echo "🏺 Pottery Unsubscribe - GitHub Pages Deployment"
echo "================================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
fi

# Add all files
echo "📦 Adding files to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy unsubscribe page to GitHub Pages"

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Please add your GitHub repository as origin:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    echo ""
    echo "   Then run this script again."
    exit 1
fi

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your GitHub repository"
echo "2. Go to Settings > Pages"
echo "3. Select 'Deploy from a branch'"
echo "4. Choose 'main' branch and '/ (root)' folder"
echo "5. Add 'potterybookings.com' as custom domain"
echo "6. Update your DNS to point potterybookings.com to GitHub Pages"
echo ""
echo "🔧 Don't forget to:"
echo "- Update API_BASE_URL in index.html if needed"
echo "- Keep your localhost server running"
echo "- Test the unsubscribe flow"
echo ""
echo "🌐 Your unsubscribe page will be available at:"
echo "   https://potterybookings.com/unsubscribe"
