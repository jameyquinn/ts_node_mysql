var _       = require('lodash')
  , config  = require('../lib/config')
  , log     = require('../lib/log')(module)
  , queue   = require('../lib/queue')
  ;


log.info('starting SQS long-polling');

queue.poll(config.get('aws:sqs:queueUrl'));

