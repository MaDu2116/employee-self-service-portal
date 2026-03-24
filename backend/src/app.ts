import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { CONFIG } from './config/constants';
import { logger } from './config/logger';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP request logging
app.use(morgan('combined', {
  stream: { write: (message: string) => logger.info(message.trim()) },
}));

// Static files for uploaded payslips
app.use('/uploads', express.static(path.join(__dirname, '..', CONFIG.UPLOAD_DIR)));

// Routes
app.use(routes);

// Error handling
app.use(errorHandler);

// Start server
if (require.main === module) {
  app.listen(CONFIG.PORT, () => {
    logger.info(`Server running on port ${CONFIG.PORT}`, {
      environment: CONFIG.NODE_ENV,
    });
  });
}

export default app;
