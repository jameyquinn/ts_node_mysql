var mysql   = require('mysql')
  , _       = require('lodash')
  , log     = require('./log')(module)
  , config  = require('./config')
  , transform  = require('./transform')
  ;

var connectionOptions = {
    connectionLimit: 10,
    acquireTimeout:  60000,
    host:            config.get('mysql:host'),
    port:            config.get('mysql:port'),
    database:        config.get('mysql:database'),
    user:            config.get('mysql:user'),
    password:        config.get('mysql:password')
  };

var pool = mysql.createPool(connectionOptions);

// we should move the following into a model to abstract data access from db connection mgmt
function createTable(){

  pool.getConnection(function(err, connection) {
    if (err) {
      log.error('error connecting: ' + err.stack);
      return false;
    }
    log.info('connected as id ' + connection.threadId);

    if(connection){
      log.info('creating db');
      connection.query(
        "CREATE SCHEMA IF NOT EXISTS '" + config.get('mysql:database') + "' DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;"
        , function(err, rows, fields) {
            if (err){
              log.info('err',err);
            }
            release(connection);
          }
      );
    }
  });
}

function createDB(){

  pool.getConnection(function(err, connection) {
    if (err) {
      log.error('error connecting: ' + err.stack);
      return false;
    }
    log.info('connected as id ' + connection.threadId);

    if(connection){
      log.info('creating db: ' + connection.threadId);
      connection.query(
        "CREATE SCHEMA IF NOT EXISTS `videos` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;"
        , function(err, rows, fields) {
            if (err){
              log.info('err',err);
            }
            if(rows && rows.length === 0){
              log.info('result', rows, fields);
            }
            release(connection);
          }
      );
    }
  });
}

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

exports.createDB = createDB;
exports.createTable = createTable;
exports.save = exports.insert = save;
