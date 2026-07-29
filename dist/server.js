"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./utils/logger");
let PORT = Number(process.env.PORT) || 5000;
function startServer(port) {
    const server = app_1.default.listen(port, '0.0.0.0', () => {
        logger_1.logger.info(`🚀 SUSRUTHA Enterprise Backend Engine running on 0.0.0.0:${port}`);
        logger_1.logger.info(`📖 Interactive Swagger Documentation: /api/v1/docs`);
    });
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            logger_1.logger.warn(`Port ${port} is in use, attempting port ${port + 1}...`);
            startServer(port + 1);
        }
        else {
            logger_1.logger.error('Server failed to start:', err);
        }
    });
}
startServer(PORT);
exports.default = app_1.default;
