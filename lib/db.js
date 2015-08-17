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
      var createQuery = "CREATE TABLE `" + config.get('mysql:database') + "`.`google_form_data_temp` (" +
        "`id`                    INT NOT NULL AUTO_INCREMENT, "  +
        "`file_name`             TEXT NULL DEFAULT NULL, " +
        "`description`           TEXT NULL DEFAULT NULL, " +
        "`teacher_count`         TEXT NULL DEFAULT NULL, " +
        "`teacher_ethnicities`   TEXT NULL DEFAULT NULL, " +
        "`student_ethnicities`   TEXT NULL DEFAULT NULL, " +
        "`activities`            TEXT NULL DEFAULT NULL, " +
        "`technical_issues`      TEXT NULL DEFAULT NULL, " +
        "`meta_username`         TEXT NULL DEFAULT NULL, " +
        "`meta_timestamp`        TEXT NULL DEFAULT NULL, " +
        "PRIMARY KEY (`id`) ) " +
        "ENGINE = MyISAM " +
        "DEFAULT CHARACTER SET = utf8;";
      connection.query(createQuery, function(err, rows, fields) {
        if (err){
          log.info('err',err);
        }
        release(connection);
      });
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
  var data = _.pick(
    transform( payload.item ),
    [
      'id'
      , 'file_name'
      , 'description'
      , 'teacher_count'
      , 'teacher_ethnicities'
      , 'student_ethnicities'
      , 'activities'
      , 'technical_issues'
      , 'meta_username'
      , 'meta_timestamp'
      ]
  )
    ;

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
