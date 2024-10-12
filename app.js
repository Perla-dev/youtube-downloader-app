const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
        <h1>YouTube Video Downloader</h1>
        <form action="/download" method="get">
            <input type="text" name="url" placeholder="Enter YouTube Video URL" required>
            <button type="submit">Download</button>
        </form>
    `);
});

app.get('/download', (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).send('A video URL is required!');
    }

    const videoPath = path.join(__dirname, 'video.mp4'); // Temporary file path

    // Use yt-dlp to download the best video and audio available
    exec(`yt-dlp -f "best" -o "${videoPath}" "${videoUrl}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error downloading video: ${stderr}`);
            return res.status(500).send('An error occurred while downloading the video.');
        }

        // After download completes, send the video as a file download
        res.download(videoPath, 'video.mp4', (err) => {
            if (err) {
                console.error(`Error sending video file: ${err}`);
            }
            // Optionally delete the video file after download
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
