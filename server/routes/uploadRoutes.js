import express from 'express';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import UploadController from '../controllers/uploadController.js';

const router = express.Router();

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Keep the file in memory; it is forwarded straight to cloud storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE, files: 1 }
});

// Attach the user when a valid token is sent, but allow anonymous requests
// (needed for the profile image in registration step 2)
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return next();

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (!err) req.user = user;
        next();
    });
};

// Run multer and turn its errors into readable JSON responses
const receiveSingleFile = (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            const message = err.code === 'LIMIT_FILE_SIZE'
                ? "The file is too large. The maximum size is 50MB."
                : `Upload failed: ${err.message}`;
            return res.status(400).json({ success: false, message });
        }
        next();
    });
};

router.post('/', optionalAuth, receiveSingleFile, UploadController.uploadFile);

export default router;
