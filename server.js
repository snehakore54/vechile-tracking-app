const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));

// Serve static files (for vehicle icon)
app.use('/static', express.static(path.join(__dirname, 'public')));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Endpoint to get the vehicle's current location
app.get('/location', (req, res) => {
  const data = JSON.parse(fs.readFileSync('data/vehicle-data.json', 'utf8'));
  const latestLocation = data[data.length - 1];
  res.json(latestLocation);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
