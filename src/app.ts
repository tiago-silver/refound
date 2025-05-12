import 'express-async-errors';
import express from 'express';
import cors from 'cors';
import { errorHandling } from './middlewares/error-handling';
import { routes } from './routes';
import uploadConfig from './config/upload';

const app = express();

app.use(cors());
app.use(express.json());

// Rotas para visualizar os arquivos carregados
app.use("/uploads", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use(errorHandling)

export {app}