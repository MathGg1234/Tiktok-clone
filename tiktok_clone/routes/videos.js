const express = require('express');
const multer = require('multer');
const Video = require('../models/Video');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.post('/', authMiddleware, upload.single('video'), async (req, res) => {
    const { description } = req.body;
    const videoUrl = req.file.path;

    try {
        const video = await Video.create({
            description,
            videoUrl,
            userId: req.user.id
        });
        res.status(201).json(video);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
