# GitHub Pages Unsubscribe System

This folder contains the unsubscribe page that will be hosted on GitHub Pages at `Potterybookings.com/unsubscribe`.

## 🚀 Deployment to GitHub Pages

### Step 1: Create GitHub Repository
1. Create a new repository called `pottery-unsubscribe` (or similar)
2. Upload the `index.html` file to the root of the repository

### Step 2: Enable GitHub Pages
1. Go to repository Settings
2. Scroll down to "Pages" section
3. Select "Deploy from a branch"
4. Choose "main" branch and "/ (root)" folder
5. Click "Save"

### Step 3: Configure Custom Domain
1. In the Pages settings, add `potterybookings.com` as custom domain
2. Add a CNAME file to the repository root with content: `potterybookings.com`
3. Update your DNS to point `potterybookings.com` to GitHub Pages

### Step 4: Update API URL
In `index.html`, update the `API_BASE_URL` to point to your localhost server:

```javascript
// For development
const API_BASE_URL = 'http://localhost:3001';

// For production (if you have a public server)
const API_BASE_URL = 'https://your-server.com';
```

## 🔧 How It Works

### Architecture:
```
GitHub Pages (potterybookings.com/unsubscribe)
    ↓ (AJAX calls)
Your Localhost Server (localhost:3001)
    ↓ (stores data)
Local File System (unsubscribes.json)
```

### Flow:
1. User clicks unsubscribe link in email
2. Redirected to `potterybookings.com/unsubscribe?email=user@example.com`
3. GitHub Pages serves the unsubscribe page
4. User selects action (unsubscribe/preferences/pause)
5. Page makes AJAX call to your localhost server
6. Localhost server stores unsubscribe data
7. Future emails are blocked by localhost server

## 📧 Email Template URLs

Update your email templates to use the new GitHub Pages URL:

```html
<!-- Old URL -->
<a href="https://unsub.mixedchicago.com/unsubscribe?email={{email}}&token={{token}}">Unsubscribe</a>

<!-- New URL -->
<a href="https://potterybookings.com/unsubscribe?email={{email}}&token={{token}}">Unsubscribe</a>
```

## 🛡️ Security Features

- **CORS Protection**: Only allows requests from `potterybookings.com`
- **Input Validation**: Validates email format and required fields
- **Rate Limiting**: Built into your localhost server
- **Audit Trail**: Logs IP, timestamp, user agent

## 📁 File Structure

```
github-pages-unsubscribe/
├── index.html          # Main unsubscribe page
├── README.md          # This file
└── .gitignore         # Git ignore file
```

## 🔄 Testing

### Local Testing:
1. Serve the HTML file locally
2. Update `API_BASE_URL` to `http://localhost:3001`
3. Test the unsubscribe flow

### Production Testing:
1. Deploy to GitHub Pages
2. Test with real email addresses
3. Verify data is stored on localhost

## 🚨 Important Notes

- **Keep localhost running**: The GitHub Pages site depends on your localhost server
- **CORS configuration**: Make sure your localhost server allows requests from `potterybookings.com`
- **Backup data**: The unsubscribe data is stored locally, so backup regularly
- **SSL**: GitHub Pages provides free SSL, but your localhost needs to be accessible

## 🆘 Troubleshooting

### CORS Errors:
- Check that your localhost server allows `potterybookings.com` in CORS settings
- Verify the API_BASE_URL is correct

### Data Not Saving:
- Ensure your localhost server is running
- Check server logs for errors
- Verify file permissions on the data directory

### Page Not Loading:
- Check GitHub Pages deployment status
- Verify custom domain configuration
- Check DNS settings

## 📞 Support

If you need help with deployment or configuration, check:
1. GitHub Pages documentation
2. Your localhost server logs
3. Browser developer console for errors
