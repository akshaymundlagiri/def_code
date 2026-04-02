const express = require('express');
const path = require('path');
const app = express();
const PORT = 5173;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║      Code Battle Running!              ║
║  Open browser to http://localhost:5173 ║
╚════════════════════════════════════════╝
  `);
});
