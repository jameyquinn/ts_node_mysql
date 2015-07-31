
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
  log.info('handling messages: ', data);
  if(err) {
    log.info(err);
    getMessages(queue);
    return;
  }
  if(data && data.Messages){
    log.info('message received');

    _.map(data.Messages, function(message) {
      var body = JSON.parse(message.Body);
      db.insert(body);
      removeFromQueue(message);
    });
  }
  getMessages(queue);
}

function getMessages(sqsQueueUrl){
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

