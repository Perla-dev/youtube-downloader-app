const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/download', (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).send('A video URL is required!');
    }

    const videoPath = path.join(__dirname, 'video.mp4'); // Temporary file path

    // Use yt-dlp to download the best video and audio available
    exec(`yt-dlp -f "best" -o "${videoPath}" ${videoUrl}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error downloading video: ${stderr}`);
            return res.status(500).send('An error occurred while downloading the video.');
        }

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
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
