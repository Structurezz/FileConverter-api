import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Files are saved to the upload directory
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName); // Create unique filenames to avoid conflicts
    },
});

// Initialize Multer with storage
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


export const singleFileUpload = upload.single('file'); // Expecting a single file field named 'file'
export const multipleFileUpload = upload.array('files', 5); // Expecting multiple files with the field name 'files'
