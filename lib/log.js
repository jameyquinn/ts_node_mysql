var winston = require('winston')
,   libs = process.cwd() + '/lib/'
,   config = require(libs + 'config')
;

winston.emitErrs = true;

function logger(module, options) {

  return new winston.Logger({
    transports : [
      new winston.transports.File({
        level: config.get('log:file:level') || config.get('log:level') ||'info',
        filename: config.get('log:file:path') || (process.cwd() + '/logs/all.log'),
        handleException: true,
        json: true,
        maxSize: 5242880, //5mb
        maxFiles: 2,
        colorize: false
      }),
      new winston.transports.Console({
        level: config.get('log:console:level') || 'warn',
        label: getFilePath(module),
        handleException: true,
        json: false,
        colorize: config.get('log:console:colorize') || config.get('log:colorize'),
      })
    ],
    exitOnError: false
  });
}

function getFilePath (module ) {
  //using filename in log statements
  return module.filename.split('/').slice(-2).join('/');
}

module.exports = logger;
