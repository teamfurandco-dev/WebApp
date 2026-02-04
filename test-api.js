// Quick test to verify API endpoints
console.log('Testing API endpoints...');

// Test the API endpoints
fetch('http://localhost:3000/api/test')
  .then(res => res.json())
  .then(data => console.log('Test endpoint:', data))
  .catch(err => console.error('Test endpoint error:', err));

fetch('http://localhost:3000/api/home')
  .then(res => res.json())
  .then(data => console.log('Home endpoint:', data))
  .catch(err => console.error('Home endpoint error:', err));
