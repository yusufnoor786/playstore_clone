const express = require('express');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve your frontend static files from ./public
app.use(express.static(path.join(__dirname, 'public')));

// Simple API: list apps (serves apps.json)
app.get('/api/apps', (req, res) => {
  const file = path.join(__dirname, 'apps.json');
  if (!fs.existsSync(file)) return res.status(500).json({error:'apps.json missing'});
  const data = JSON.parse(fs.readFileSync(file,'utf8'));
  res.json(data);
});

// Serve APKs with correct MIME and Content-Disposition
// Place your apk files under ./apks/app-package-name.apk
app.get('/apks/:file', (req, res) => {
  const filename = path.basename(req.params.file);
  const filePath = path.join(__dirname, 'apks', filename);
  if (!fs.existsSync(filePath)) return res.status(404).send('Not found');

  // set MIME for apk
  const mimeType = 'application/vnd.android.package-archive';
  res.setHeader('Content-Type', mimeType);

  // Suggest download and set filename for convenience
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  // Serve file
  res.sendFile(filePath);
});

// Start
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
