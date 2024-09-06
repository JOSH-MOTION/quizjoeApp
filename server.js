const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // Enable CORS

app.use(express.static('public')); // Serve static files from the public folder

app.get('/Biology.json', (req, res) => {
  res.sendFile(__dirname + '/public/Biology.json');
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
