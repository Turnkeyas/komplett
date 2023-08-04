var winston = require('winston');
import { format } from 'winston';
require('winston-daily-rotate-file');

var transport = new (winston.transports.DailyRotateFile)({
    filename: 'logs/application-%DATE%.log',
    // datePattern: 'YYYY-MM-DD-HH',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '30d',
});

transport.on('rotate', function (_oldFilename: any, _newFilename: any) {
    // do something fun
    console.log('filename : ', _newFilename)
});

export const logger = winston.createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        transport
    ]
});

//example :  logger.log('error',new Error('some'),{ file: 'customer --> customer.controller' , request :req.method +' :' + req.baseUrl+req.url})
