# Google Sheets Integration Setup Guide

## Overview
Your gym registration system now saves data directly to Google Sheets instead of local files. This means all member data will be stored in the cloud and accessible from anywhere.

## Required Setup Steps

### 1. Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it (e.g., "LemonCore Gym Registration")
4. Click "Create"

### 2. Enable Google Sheets API
1. In your new project, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

### 3. Create Service Account
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in:
   - Service account name: `lemoncore-gym`
   - Service account description: `Google Sheets integration for gym registration`
4. Click "Create and Continue"
5. Skip the optional steps (click "Done")

### 4. Create and Download Credentials
1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select "JSON" and click "Create"
5. **Important:** Save the downloaded JSON file as `credentials.json` in your project root

### 5. Share Your Google Sheet
1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1XqAxZTZvWka4o0gPaXgSv6W_KcFXfX0UR1x_LHeRoVc/edit
2. Click "Share" in the top right
3. Add the service account email (from the JSON file, look for `client_email`)
4. Give it "Editor" permissions
5. Click "Send"

### 6. Configure Environment Variables
The `.env` file is already created with the correct configuration. Make sure:
- Your `credentials.json` file is in the project root
- The `.env` file has `GOOGLE_APPLICATION_CREDENTIALS=./credentials.json`

## For Production Deployment

When deploying to production:
1. Encode your credentials.json file:
   ```bash
   cat credentials.json | base64 -w 0
   ```
2. Set the `GOOGLE_CREDENTIALS_BASE64` environment variable in your deployment platform
3. Do NOT commit the actual `credentials.json` file to your repository

## Testing

Once setup is complete:
1. Start your development server: `npm run dev`
2. Register a new member
3. Check your Google Sheet - the data should appear immediately

## Troubleshooting

**"API key not authorized" error:**
- Make sure you enabled the Google Sheets API
- Check that the service account email has "Editor" permissions on the sheet

**"File not found" error:**
- Ensure `credentials.json` is in the project root
- Check the `.env` file has the correct path

**No data appearing in sheet:**
- Verify the service account email was added to the sheet with "Editor" permissions
- Check the browser console for any errors
