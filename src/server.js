const app = require('./app');

const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

const server = app.listen(port, host, () => {
  console.log(JSON.stringify({
    level: 'info',
    message: 'CloudOps Monitor started',
    host,
    port,
    environment: process.env.NODE_ENV || 'development',
    version: process.env.APP_VERSION || '1.0.0'
  }));
});

function shutdown(signal) {
  console.log(JSON.stringify({ level: 'info', message: `${signal} received; shutting down` }));
  server.close((error) => {
    if (error) {
      console.error(JSON.stringify({ level: 'error', message: 'Shutdown failed', error: error.message }));
      process.exit(1);
    }
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
