const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.static('public'));

app.get('/quiz/:subject', (req, res) => {
  const { subject } = req.params;
  const filePath = path.join(__dirname, 'public', `${subject}.json`);
  console.log(`Request for ${subject}.json at ${filePath}`); // Debug log

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error serving ${subject}.json: ${err.message}`);
      res.status(404).json({ error: 'Subject not found' });
    }
  });
});

// Optional: Explicit static route for clarity
app.get('/:subject.json', (req, res) => {
  const { subject } = req.params;
  const filePath = path.join(__dirname, 'public', `${subject}.json`);
  res.sendFile(filePath, (err) => {
    if (err) res.status(404).json({ error: 'File not found' });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://192.168.100.103:${PORT}`);
});