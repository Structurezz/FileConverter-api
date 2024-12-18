import { convertPdfToWord, convertWordToPdf } from '../services/conversionService.js';
import path from 'path';
import serverConfig from '../../lib/config/serverConfig.js'; 
import { ensureDirectoryExists, sanitizeFilename } from '../../lib/utils/fileUtils.js'; 
import { removeFile } from '../../lib/utils/helpers.js'; 
import fs from 'fs-extra';


// Ensure the upload directory exists
ensureDirectoryExists(serverConfig.uploadDir);

const logUploadedFiles = async () => {
    try {
        const files = await fs.readdir(serverConfig.uploadDir);
        console.log('Files in upload directory:', files);
    } catch (err) {
        console.error('Error reading directory:', err);
    }
};


logUploadedFiles();

export const uploadFileController = async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const sanitizedFilename = sanitizeFilename(file.originalname);
    const filePath = path.join(serverConfig.uploadDir, sanitizedFilename);

    try {
        // The uploaded file is already handled by multer, so we don't need to write it again.
        await logUploadedFiles();  // Log uploaded files
        res.status(200).json({ message: 'File uploaded successfully', filename: sanitizedFilename });
    } catch (error) {
        console.error('Error during file upload:', error);
        res.status(500).json({ message: 'File upload failed: ' + error.message });
    }
};

// Controller to convert PDF to Word using filename
export const convertPdfToWordController = async (req, res) => {
    const { filename } = req.params; // Get filename from URL parameters
    const sanitizedFilename = sanitizeFilename(filename); // Sanitize the filename
    const pdfPath = path.join(serverConfig.uploadDir, sanitizedFilename);

    // Check if the file exists
    if (!fs.existsSync(pdfPath)) {
        return res.status(404).json({ message: `File not found: ${sanitizedFilename}` });
    }

    try {
        const convertedPath = await convertPdfToWord(pdfPath);
        res.status(200).json({ message: 'File converted successfully', filename: path.basename(convertedPath) });
    } catch (error) {
        console.error('PDF to Word conversion error:', error);
        res.status(500).json({ message: `Conversion failed: ${error.message}` });
    } finally {
        // Optionally, cleanup: Remove the original PDF file if you want
        try {
            await removeFile(pdfPath);
        } catch (cleanupError) {
            console.error('Error removing file:', cleanupError);
        }
    }
};


// Controller to convert Word to PDF
export const convertWordToPdfController = async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const sanitizedFilename = sanitizeFilename(file.originalname);
    const wordPath = path.join(serverConfig.uploadDir, sanitizedFilename);

    try {
        const pdfPath = await convertWordToPdf(wordPath);
        res.status(200).json({ message: 'File converted successfully', filename: path.basename(pdfPath) });
    } catch (error) {
        console.error('Word to PDF conversion error:', error);
        res.status(500).json({ message: `Conversion failed: ${error.message}` });
    } finally {
        // Cleanup: Remove the original Word file
        await removeFile(wordPath);
    }
};

// Controller to download a file
export const downloadFileController = (req, res) => {
    const { filename } = req.params;
    const sanitizedFilename = sanitizeFilename(filename);
    const filePath = path.join(serverConfig.uploadDir, sanitizedFilename);

    res.download(filePath, (err) => {
        if (err) {
            console.error('Download error:', err);
            res.status(404).json({ message: 'File not found' });
        }
    });
};
