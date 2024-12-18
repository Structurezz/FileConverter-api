import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import converterRoutes from '../routes/fileRoutes.js';
import errorHandler from '../app/middleware/errorHandler.js';
import multer from 'multer';

dotenv.config();
console.log('PORT:', process.env.PORT);

const app = express();

app.set('trust proxy', true);
app.use(bodyParser.json());
app.use('/convert', converterRoutes);
app.use(errorHandler);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export { server, app };
