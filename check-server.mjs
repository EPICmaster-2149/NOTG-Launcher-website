import http from 'http';
http.get('http://localhost:3000/', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Length:', data.length);
    console.log('Has root id:', data.includes('id="root"'));
    console.log('First 500 chars:', data.substring(0, 500));
  });
}).on('error', e => console.log('Error:', e.message));
