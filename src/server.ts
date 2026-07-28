import app from './app';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;

app.listen(Number(PORT), '0.0.0.0', () => {
  logger.info(`🚀 SUSRUTHA Enterprise Backend Engine running on 0.0.0.0:${PORT}`);
  logger.info(`📖 Interactive Swagger Documentation: /api/v1/docs`);
});

export default app;
