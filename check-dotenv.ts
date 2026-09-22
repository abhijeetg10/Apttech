import fs from 'fs';
const envFile = fs.readFileSync('.env.local', 'utf8');
const lines = envFile.split('\n');
const keyLine = lines.find(l => l.startsWith('GOOGLE_PRIVATE_KEY='));
if (keyLine) {
  let val = keyLine.substring('GOOGLE_PRIVATE_KEY='.length);
  // Remove outer quotes if any
  if (val.startsWith('"') && val.endsWith('"')) {
    val = val.substring(1, val.length - 1);
  }
  console.log("Raw from file:", JSON.stringify(val));
  console.log("Replaced:", JSON.stringify(val.replace(/\\n/g, '\n')));
}
