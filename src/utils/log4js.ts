import log4js from 'log4js'
import path from 'path'
import { DirPath } from '../../config.js'
// 加载配置文件
log4js.configure(path.join(DirPath, 'src', 'log4js.json'));

// 获取logger对象
export const logger: Log4jsLogger = log4js.getLogger();
//定义类型
interface Log4jsLogger {
    info: (msg: any, ...args: any[]) => void;
    warn: (msg: any, ...args: any[]) => void;
    error: (msg: any, ...args: any[]) => void;
    debug: (msg: any, ...args: any[]) => void;
    trace: (msg: any, ...args: any[]) => void;
    log: (msg: any, ...args: any[]) => void;

}

declare global {
    interface Global {
        logger: Log4jsLogger;
    }
    var logger: Log4jsLogger;
}


console.log = logger.info.bind(logger);
console.error = logger.error.bind(logger);
console.info = logger.info.bind(logger);
console.warn = logger.warn.bind(logger);

global.logger = logger;
// logger.info('This is an info message.');
// logger.warn('This is a warning message.');
// logger.error('This is an error message.');
