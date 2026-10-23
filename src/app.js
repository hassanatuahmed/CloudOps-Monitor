const express = require('express');

const app = express();
app.disable('x-powered-by');
app.use(express.json());

const APP_NAME = process.env.APP_NAME || 'CloudOps Monitor';
const APP_VERSION = process.env.APP_VERSION || '1.0.0';
const APP_ENV = process.env.NODE_ENV || 'development';

app.get('/', (_req, res) => {
  res.status(200).json({
    message: `Welcome to ${APP_NAME}`,
    version: APP_VERSION,
    health: '/health',
    info: '/info'
  });
});

app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptimeSeconds: Math.floor(process.uptime())
  });
});

app.get('/info', (_req, res) => {
  res.status(200).json({
    name: APP_NAME,
    version: APP_VERSION,
    environment: APP_ENV,
    nodeVersion: process.version
  });
});

app.get('/version', (_req, res) => {
  res.status(200).json({
    name: APP_NAME,
    version: APP_VERSION
  });
});

app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

module.exports = app;
