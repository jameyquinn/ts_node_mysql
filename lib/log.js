var winston = require('winston')
,   config = require('./config')
;

winston.emitErrs = true;

function logger(module, options) {
  var transports = [];

  if (config.get('log:file:path')){
    transports.push( new winston.transports.File({
        level: config.get('log:file:level') || config.get('log:level') ||'info',
        filename: config.get('log:file:path') || (process.cwd() + '/logs/all.log'),
        handleException: true,
        json: true,
        maxSize: 5242880, //5mb
        maxFiles: 2,
        colorize: false,
        timestamp: true
      })
    );
  }

  transports.push( new winston.transports.Console({
      level: config.get('log:console:level') || 'info',
      label: getFilePath(module),
      handleException: true,
      json: false,
      colorize: config.get('log:console:colorize') || config.get('log:colorize'),
      timestamp: true
    })
  );

  return new winston.Logger({
    transports : transports,
    exitOnError: false
  });
}

function getFilePath (module ) {
  //using filename in log statements
  return module.filename.split('/').slice(-2).join('/');
}

module.exports = logger;
