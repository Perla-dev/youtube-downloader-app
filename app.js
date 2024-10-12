const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs'); // Ensure fs is required for file handling

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', async (req, res) => {
    res.send(`
        <h1>YouTube Video Downloader</h1>
        <form action="/download" method="get">
            <input type="text" name="url" placeholder="Enter YouTube Video URL" required>
            <button type="submit">Download</button>
        </form>
    `);
});

app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).send('A video URL is required!');
    }

    const videoPath = path.join(__dirname, 'video.mp4'); // Temporary file path

    try {
        // Use child_process exec to execute yt-dlp command line directly
        await new Promise((resolve, reject) => {
            exec(`yt-dlp -f "best" -o "${videoPath}" ${videoUrl}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error downloading video: ${stderr}`);
                    reject(error);
                } else {
                    console.log(`Downloaded video successfully: ${stdout}`);
                    resolve();
                }
            });
        });

        // After download completes, send the video as a file download
        res.download(videoPath, 'video.mp4', (err) => {
            if (err) {
                console.error(`Error sending video file: ${err}`);
            }

            // Check if the file exists before deleting
            if (fs.existsSync(videoPath)) {
                fs.unlinkSync(videoPath); // Delete the temporary video file
            } else {
                console.error('File not found for deletion:', videoPath);
            }
        });
    } catch (error) {
        console.error(`Error downloading video: ${error}`);
        return res.status(500).send('An error occurred while downloading the video.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
