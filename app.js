const express = require('express');
const fs = require('fs');
const ytdl = require('ytdl-core');
const app = express();
const port = process.env.PORT || 3000;

// Default route to serve a simple HTML form
app.get('/', (req, res) => {
  res.send(`
    <h1>YouTube Video Downloader</h1>
    <form action="/download" method="get">
      <input type="text" name="url" placeholder="Enter YouTube Video URL" required>
      <button type="submit">Download</button>
    </form>
  `);
});

// Download route
app.get('/download', (req, res) => {
  const videoUrl = req.query.url;

  res.header('Content-Disposition', 'attachment; filename=video.mp4');
  ytdl(videoUrl, { quality: 'highestvideo' })
    .pipe(res)
    .on('finish', () => {
      // Optionally, delete the video file after download (if you are saving it)
    })
    .on('error', (err) => {
      console.error('Error sending video file:', err);
      res.status(500).send('Error downloading video.');
    });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
