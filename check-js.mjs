import http from 'http';
http.get('http://localhost:3000/src/main.tsx', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('JS Status:', res.statusCode);
    console.log('JS Length:', data.length);
    console.log('First 300:', data.substring(0, 300));
  });
}).on('error', e => console.log('Error:', e.message));
