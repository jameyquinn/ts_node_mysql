var _       = require('lodash')
  , config  = require('../lib/config')
  , log     = require('../lib/log')(module)
  , queue   = require('../lib/queue')
  , db      = require('../lib/db')
  ;

//make sure the table is there
db.createTable( )
  .then(function(){
    // log.info('table created');
  })
  .catch(function(err){
    log.error('',err);
  })
;

log.info('starting SQS long-polling');

queue.poll(config.get('aws:sqs:queueUrl'));

