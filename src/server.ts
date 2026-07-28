import app from './app';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`🚀 SUSRUTHA Enterprise Backend Engine running on http://localhost:${PORT}`);
  logger.info(`📖 Interactive Swagger Documentation: http://localhost:${PORT}/api/v1/docs`);
});

export default app;
