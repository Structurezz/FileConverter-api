import libre from 'libreoffice-convert';
import fs from 'fs-extra';
import { exec } from 'child_process';
import util from 'util';
import path from 'path'; // Ensure to import path

const execPromise = util.promisify(exec);

// Upload file function
export const uploadFile = async (file) => {
    try {
        // Check if file exists
        if (!file) {
            throw new Error('No file uploaded.');
        }
        const filePath = path.join(__dirname, 'uploads', file.originalname);
        await fs.writeFile(filePath, file.buffer);
        return filePath;
    } catch (error) {
        console.error('Error during file upload:', error);
        throw new Error('File upload failed: ' + error.message);
    }
};

// Convert PDF to Word
export const convertPdfToWord = async (pdfFilePath) => {
    return new Promise((resolve, reject) => {
        // Read the PDF file
        const pdfFile = fs.readFileSync(pdfFilePath);
        
        // Define the output path for the Word file
        const wordFilePath = pdfFilePath.replace(/\.pdf$/, '.docx');
        
        // Convert the file
        libre.convert(pdfFile, '.docx', undefined, (err, result) => {
            if (err) {
                return reject(new Error('Conversion error: ' + err.message));
            }
            // Save the converted Word file
            fs.writeFileSync(wordFilePath, result);
            resolve(wordFilePath);
        });
    });
};

// Convert Word to PDF
export const convertWordToPdf = async (wordPath) => {
    console.log('Converting Word to PDF:', wordPath);
    try {
        // Validate file extension
        if (!wordPath.endsWith('.docx')) {
            throw new Error('Input file must be a DOCX.');
        }

        // Convert using LibreOffice
        const { stdout, stderr } = await execPromise(`libreoffice --headless --convert-to pdf "${wordPath}" --outdir "${path.dirname(wordPath)}"`);
        if (stderr) {
            throw new Error(`Conversion error: ${stderr}`);
        }
        console.log('LibreOffice Output:', stdout);

        // Construct the expected output path for the converted file
        const outputPdfPath = wordPath.replace(/\.docx$/, '.pdf');

        // Check if the converted PDF file exists before returning
        const exists = await fs.pathExists(outputPdfPath);
        if (!exists) {
            throw new Error(`Converted PDF file does not exist at path: ${outputPdfPath}`);
        }

        return outputPdfPath; // Return the path of the converted file
    } catch (error) {
        console.error('Error during Word to PDF conversion:', error);
        throw new Error('Word to PDF conversion failed: ' + error.message);
    }
};

// Download file function
export const downloadFile = async (filePath, res) => {
    try {
        if (!filePath || !(await fs.pathExists(filePath))) {
            throw new Error('File does not exist.');
        }
        res.download(filePath, (err) => {
            if (err) {
                console.error('Error downloading the file:', err);
                res.status(500).send({ message: 'Error downloading the file', error: err.message });
            }
        });
    } catch (error) {
        console.error('Error during file download:', error);
        res.status(500).send({ message: 'File download failed', error: error.message });
    }
};
