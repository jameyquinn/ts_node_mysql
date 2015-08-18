var Promise = require('bluebird')
  , mysql   = Promise.promisifyAll(require('mysql'))
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
    // database:        config.get('mysql:database'),
    user:            config.get('mysql:user'),
    password:        config.get('mysql:password')
  };

var pool = Promise.promisifyAll(mysql.createPool(connectionOptions));

function createDB(connection){
  log.info('creating db: ' + connection.threadId);
  return connection.queryAsync(
    "CREATE SCHEMA IF NOT EXISTS `" + config.get('mysql:database') + "` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;"
  );
}

// we should move the following into a model to abstract data access from db connection mgmt
function createTable(){

  log.info('creating table');
  var createQuery = "CREATE TABLE `" + config.get('mysql:database') + "`.`usage_recommendations` (" +
      "`id`                  INT     NOT NULL AUTO_INCREMENT, " +
      "`timestamp`           TEXT, " +
      "`username`            TEXT, " +
      "`file_name`           TEXT, " +
      "`description`         TEXT, " +
      "`teacher_count`       TEXT, " +
      "`teacher_ethnicities` TEXT, " +
      "`student_ethnicities` TEXT, " +
      "`activities`          TEXT, " +
      "`technical_issues`    TEXT, " +
      "`start_1`             TEXT, " +
      "`stop_1`              TEXT, " +
      "`usage_1`             TEXT, " +
      "`notes_1`             TEXT, " +
      "`start_2`             TEXT, " +
      "`stop_2`              TEXT, " +
      "`usage_2`             TEXT, " +
      "`notes_2`             TEXT, " +
      "`start_3`             TEXT, " +
      "`stop_3`              TEXT, " +
      "`usage_3`             TEXT, " +
      "`notes_3`             TEXT, " +
      "`start_4`             TEXT, " +
      "`stop_4`              TEXT, " +
      "`usage_4`             TEXT, " +
      "`notes_4`             TEXT, " +
      "`start_5`             TEXT, " +
      "`stop_5`              TEXT, " +
      "`usage_5`             TEXT, " +
      "`notes_5`             TEXT, " +
      "`start_6`             TEXT, " +
      "`stop_6`              TEXT, " +
      "`usage_6`             TEXT, " +
      "`notes_6`             TEXT, " +
      "`start_7`             TEXT, " +
      "`stop_7`              TEXT, " +
      "`usage_7`             TEXT, " +
      "`notes_7`             TEXT, " +
      "`start_8`             TEXT, " +
      "`stop_8`              TEXT, " +
      "`usage_8`             TEXT, " +
      "`notes_8`             TEXT, " +
      "`start_9`             TEXT, " +
      "`stop_9`              TEXT, " +
      "`usage_9`             TEXT, " +
      "`notes_9`             TEXT, " +
      "`start_10`            TEXT, " +
      "`stop_10`             TEXT, " +
      "`usage_10`            TEXT, " +
      "`notes_10`            TEXT, " +
      "`meta`                TEXT, " +

    "PRIMARY KEY (`id`) ) " +
    "ENGINE = MyISAM " +
    "DEFAULT CHARACTER SET = utf8;";

  return pool.getConnectionAsync()
    .then(function(connection){
      if(connection){
        return connection.query(createQuery, function(err, rows, columns){

        });
      }
    })
    ;

}

function insert(payload, meta) {
  var data = transform( payload, meta );
  log.info('data',data);

  return pool.getConnectionAsync()
    .then(function(connection){
      if(connection){
        log.info('connection established: ' + connection.threadId);

        connection.beginTransaction(function(err) {
          if (err) { throw err; }
          return connection.query(
            "INSERT INTO `videos`.`usage_recommendations` SET ?"
            , data
            , function(err, rows, columns){
                if (err){
                  connection.rollback(function() {
                    throw err;
                  });
                  release(connection);
                }
                log.info('result',rows);

                connection.commit(function(err) {
                  if (err) {
                    connection.rollback(function() {
                      throw err;
                    });
                  }
                  log.info('Transaction Complete.');
                  release(connection);
                });
              }
          );
        });
      }
    })
    .catch(function(err){
      log.error('trouble: ', err);
    })
    ;

}

function release(cnx){
  log.info('releasing connection: ', cnx.threadId);
  cnx.release();
}

exports.pool = pool;
exports.createDB = createDB;
exports.createTable = createTable;
exports.insert = insert;
