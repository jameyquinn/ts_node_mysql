
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
  if(err) {
    log.error(err);
    getMessages(queue);
    return;
  }
  if(data && data.Messages){
    _.map(data.Messages, function(message) {
      console.log(message);
      // Get the first message (should be the only one since we said to only get one above)
      var body = JSON.parse(message.Body);
      db.insert(body);
      removeFromQueue(message);
    });
  }
  getMessages(queue);
}

function getMessages(sqsQueueUrl){
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

