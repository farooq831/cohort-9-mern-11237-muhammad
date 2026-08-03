const express = require('express');
const cors = require('cors');
require('dotenv').config();

const logger = require('./utils/logger');
const requestLogger = require('./middleware/requestLogger');

const app = express();

// Request and response logging must be registered before routes 
// so every request gets logged including 404s
app.use(requestLogger);

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  logger.info('Health check requested');
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app;