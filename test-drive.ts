import { google } from 'googleapis';

const apiKey = "AIzaSyD_cuYCoGbLeZORrJUyR_prxXYK9CzqJcc";
const folderId = "1aGDaGk6dWuy_B7MCZOPp9xd1p3T5_5AD";

async function testDrive() {
  const drive = google.drive({ version: 'v3', auth: apiKey });
  
  try {
    const res = await drive.files.list({
      q: `'${folderId}' in parents and trashed=false`,
      fields: 'files(id, name, mimeType)',
    });
    console.log("Files found:", res.data.files?.length);
    console.log(res.data.files);
  } catch (err: any) {
    console.error("Error from Drive API:", err.message);
  }
}

testDrive();
