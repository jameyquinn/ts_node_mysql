var mysql   = require('mysql')
  , _       = require('lodash')
  , log     = require('./log')(module)
  , config  = require('./config')
  , transform  = require('./transform')
  ;

var connectionOptions = {
    connectionLimit: 10,
    acquireTimeout:  60000,
    host:            config.get('MYSQL_HOST'),
    port:            config.get('MYSQL_PORT'),
    database:        config.get('MYSQL_DATABASE'),
    user:            config.get('MYSQL_USER'),
    password:        config.get('MYSQL_PASSWORD')
  };

var pool = mysql.createPool(connectionOptions);



// we should move the following into a model to abstract data access from db connection mgmt

function save(payload) {
  log.info('payload',payload);
  var data = transform( payload.item );

  pool.getConnection(function(err, connection) {
    if (err) {
      log.error('error connecting: ' + err.stack);
      return false;
    }
    log.info('connected as id ' + connection.threadId);

    if(connection){
      log.info('begin transaction on: ' + connection.threadId);
      connection.beginTransaction(function(err) {
        if (err) { throw err; }

        connection.query(
          'INSERT INTO google_form_data SET ?'
          , data
          , function(err, result) {
              if (err){
                connection.rollback(function() {
                  throw err;
                });
                release(connection);
              }
              log.info('result',result);

              connection.commit(function(err) {
                if (err) {
                  connection.rollback(function() {
                    throw err;
                  });
                }
                log.info('Transaction Complete.');
                release(connection);
              });
            });
      });
    }

  });
}

function release(cnx){
  log.info('releasing connection: ', cnx.threadId);
  cnx.release();
}

exports.save = save;
exports.insert = save;
