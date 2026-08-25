const express = require('express');
const cors = require('cors');
require('dotenv').config();

const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const sanitizeRequestBody = require('./middleware/sanitizeRequestBody');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

const app = express();

app.use(requestLogger);
app.use(cors());
app.use(express.json());

// strips any $ or . keys from request bodies before they ever
// reach a database query, closing NoSQL injection risk at the
// entry point rather than inside individual functions
app.use(sanitizeRequestBody);

app.get('/api/health', (req, res) => {
  logger.info('Health check requested');
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  if (!process.env.JWT_SECRET) {
    logger.error('JWT_SECRET is not set. Refusing to start.');
    process.exitCode = 1;
    return;
  }

  try {
    await connectDB();
    logger.info('MongoDB connected successfully');
  } catch (err) {
    logger.error({ err }, 'Unable to connect to MongoDB');
    process.exitCode = 1;
    return;
  }

  app.listen(PORT, (err) => {
    if (err) {
      logger.error({ err }, 'Server failed to start');
      process.exitCode = 1;
      return;
    }
    logger.info(`Server running on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;