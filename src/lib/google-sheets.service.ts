import { google } from 'googleapis';
import { readFileSync } from 'fs';

// Extract spreadsheet ID from the URL
const SPREADSHEET_ID = '1XqAxZTZvWka4o0gPaXgSv6W_KcFXfX0UR1x_LHeRoVc';

// Initialize Google Sheets API
async function getSheetsClient() {
  let credentials: any;

  // Try to use base64 encoded credentials first (for production)
  const base64Credentials = process.env.GOOGLE_CREDENTIALS_BASE64;
  if (base64Credentials) {
    try {
      const credentialsJson = Buffer.from(base64Credentials, 'base64').toString('utf-8');
      credentials = JSON.parse(credentialsJson);
    } catch (error) {
      console.error('Failed to parse base64 credentials:', error);
    }
  }

  // Fall back to file-based credentials (for local development)
  if (!credentials) {
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './credentials.json';
    try {
      credentials = JSON.parse(readFileSync(credentialsPath, 'utf-8'));
    } catch (error) {
      console.error('Failed to read credentials file:', error);
      throw new Error('Google Sheets credentials not found. Please set up GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_CREDENTIALS_BASE64.');
    }
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client as any });
}

export async function appendToSheet(data: any[]) {
  const sheets = await getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: 'September!A1',
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [data],
    },
  });
}

export async function getSheetData() {
  const sheets = await getSheetsClient();

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: 'September!A1:Z',
  });

  return response.data.values || [];
}

export async function initializeSheet(headers: string[]) {
  const sheets = await getSheetsClient();
  const existingData = await getSheetData();

  if (existingData.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'September!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [headers],
      },
    });
  }
}