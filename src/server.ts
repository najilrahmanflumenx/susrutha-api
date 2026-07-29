import app from './app';
import { logger } from './utils/logger';

let PORT = Number(process.env.PORT) || 5000;

function startServer(port: number) {
  const server = app.listen(port, '0.0.0.0', () => {
    logger.info(`🚀 SUSRUTHA Enterprise Backend Engine running on 0.0.0.0:${port}`);
    logger.info(`📖 Interactive Swagger Documentation: /api/v1/docs`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      logger.warn(`Port ${port} is in use, attempting port ${port + 1}...`);
      startServer(port + 1);
    } else {
      logger.error('Server failed to start:', err);
    }
  });
}

startServer(PORT);

export default app;

