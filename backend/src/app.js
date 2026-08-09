const express = require('express');
const cors = require('cors');
require('dotenv').config();

const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

// request/response logging must be registered before routes
// so every request gets logged including 404s
app.use(requestLogger);

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  logger.info('Health check requested');
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);

// no route matched anything above, so send a proper 404 instead of Express's default one
app.use(notFound);

// error handler always goes last, after every route/middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    logger.info('MongoDB connected successfully');
  } catch (err) {
    logger.error({ err }, 'Unable to connect to MongoDB');
    process.exitCode = 1;
    return;
  }

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}

module.exports = app;
