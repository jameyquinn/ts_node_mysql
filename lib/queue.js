
var AWS     = require('aws-sdk')
  , _       = require('lodash')
  , config  = require('./config')
  , log     = require('./log')(module)
  , db      = require('./db')
  , sqs     = new AWS.SQS({
      region: config.get('aws:region'),
    })
  , queue = ''
  ;

function messageHandler(err,data){
  // If there are any messages to get
  // log.info('handling messages: ', data);
  if(err) {
    log.info(err);
    getMessages(queue);
    return;
  }
  if(data && data.Messages){
    _.map(data.Messages, function(snsMessageString) {
      var snsBody = JSON.parse(snsMessageString.Body);
      var smsMessageString = snsBody.Message;
      var smsBody = JSON.parse(smsMessageString);
      var meta = {
        source: smsBody.source || 'unknown'
        , version: smsBody.version || 'unknown'
        // , messageId: snsBody.MessageId || 'unknown'
      }

      db.insert( smsBody.item, meta )
        .then(function(){
          removeFromQueue(snsMessageString);
        })
        .catch(function(err){
          log.error('',err);
        })
        ;
    });
  }
  getMessages(queue);
}

function getMessages(sqsQueueUrl){
  //make sure the table is there
  db.createTable( )
    .then(function(){
      // log.info('table created');
    })
    .catch(function(err){
      log.error('',err);
    })
  ;

  log.info('getting messages from queue: ', sqsQueueUrl);
  queue = sqsQueueUrl;
  var options = {
     QueueUrl:            sqsQueueUrl,
     MaxNumberOfMessages: 10,
     VisibilityTimeout:   30,
     WaitTimeSeconds:     20
   };
  return sqs.receiveMessage(options, messageHandler);
}

function removeFromQueue(message) {
   sqs.deleteMessage({
      QueueUrl: queue,
      ReceiptHandle: message.ReceiptHandle
   }, function(err, data) {
      if (err) {
       log.error(err);
      }
   });
}

module.exports.poll = getMessages;

