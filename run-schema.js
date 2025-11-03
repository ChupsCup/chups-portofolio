const fs = require('fs');
const https = require('https');

// Read SQL file
const sqlContent = fs.readFileSync('supabase-schema.sql', 'utf8');

// Supabase credentials
const token = 'sbp_f512786d09e02bf8306e91f089f878564cb82618';
const projectId = 'oemaqbrvwbosbinjrxei';
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

