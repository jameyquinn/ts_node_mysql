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
function create(){
  pool.getConnection(function(err, connection) {
    if (err) {
      log.error('error connecting: ' + err.stack);
      return false;
    }
    log.info('connected as id ' + connection.threadId);

    if(connection){
      log.info('begin transaction on: ' + connection.threadId);
      connection.query(
        "SELECT TABLE_NAME FROM information_schema.TABLES WHERE (TABLE_SCHEMA = '" + config.get('MYSQL_DATABASE') + "') AND (TABLE_NAME = 'google_form_data')"
        , function(err, rows, fields) {
            if (err){
              log.info('err',err);
            }
            if(rows && rows.length === 0){
              log.info('result', rows, fields);
              //have to create the table
              connection.query("CREATE TABLE `videos`.`google_form_data` (" +
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

                  "PRIMARY KEY (`id`) " +

                ") ENGINE=MyISAM DEFAULT CHARSET=utf8;"
              );
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

exports.create = create;
exports.save = save;
exports.insert = save;
