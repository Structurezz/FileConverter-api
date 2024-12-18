import express from 'express';
import multer from 'multer';
import fs from 'fs-extra';
import {
    uploadFileController,
    convertPdfToWordController,
    convertWordToPdfController,
    downloadFileController,
} from '../app/controllers/fileController.js';

const router = express.Router();

// Define upload directory
const uploadDir = process.env.UPLOAD_DIR || 'uploads';

// Ensure the upload directory exists
fs.ensureDirSync(uploadDir);

// Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Files are saved to the upload directory
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName); // Create unique filenames to avoid conflicts
    },
});

// Initialize Multer with storage and file size limit (10 MB)
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
    fileFilter: (req, file, cb) => {
        // Accept only PDF or Word files
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF and Word files are allowed.'));
        }
    },
});

// Route for file upload
router.post('/upload', upload.single('file'), uploadFileController);

// Route for PDF to Word conversion
// Route for PDF to Word conversion
router.post('/pdf-to-word/:filename', convertPdfToWordController);

// Route for Word to PDF conversion
router.post('/word-to-pdf/:filename', convertWordToPdfController);


// Route for file download
router.get('/download/:filename', downloadFileController);

export default router;
