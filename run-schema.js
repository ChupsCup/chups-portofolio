const fs = require('fs');
const https = require('https');

// Read SQL file
const sqlContent = fs.readFileSync('supabase-schema.sql', 'utf8');

// Supabase credentials - read from environment variables
const token = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const projectId = process.env.SUPABASE_PROJECT_ID || '';
const url = `https://api.supabase.com/v1/projects/${projectId}/database/query`;

// Prepare request
const data = JSON.stringify({ query: sqlContent });

const options = {
  hostname: 'api.supabase.com',
  path: `/v1/projects/${projectId}/database/query`,
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

// Make request
const req = https.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Response:', responseData);
    
    if (res.statusCode === 200 || res.statusCode === 201) {
      console.log('\n✅ SQL Schema executed successfully!');
    } else {
      console.log('\n❌ Error executing SQL schema');
    }
  });
});

req.on('error', (error) => {
  console.error('Error:', error);
});

req.write(data);
req.end();

