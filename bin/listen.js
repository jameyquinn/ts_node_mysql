var _       = require('lodash')
  , config  = require('../lib/config')
  // , log     = require('../lib/log')(module)
  , queue   = require('../lib/queue')
  ;


queue.poll(config.get('aws:sqs:queueUrl'));
console.log('output');
