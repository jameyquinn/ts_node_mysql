var mysql = require('mysql')
  , log     = require('./log')(module)
  , config  = require('./config')

  ;

function connect(options){
  options = options || {
      host     : config.get('MYSQL_HOST'),
      port     : config.get('MYSQL_PORT'),
      database : config.get('MYSQL_DATABASE'),
      user     : config.get('MYSQL_USER'),
      password : config.get('MYSQL_PASSWORD')
    };


  var connection = mysql.createConnection( options );
  connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      // context.fail({ "message": "item NOT INSERTED", "error":err });
      return;
    }
    console.log('connected as id ' + connection.threadId);
  });
  return connection;
}

function connection(payload) {
  var connection = connect();
  var data  = payload || {title: 'Hello MySQL'};

  /* Begin transaction */
  connection.beginTransaction(function(err) {
    if (err) { throw err; }
    connection.query('INSERT INTO lambda_insert_test SET ?', data, function(err, result) {
      if (err){
        connection.rollback(function() {
          throw err;
        });
      }
      console.log('result',result);
      // var log = result.insertId;

      connection.commit(function(err) {
        if (err) {
          connection.rollback(function() {
            throw err;
          });
        }
        console.log('Transaction Complete.');
        connection.end();
      });
    });
  });
  /* End transaction */
};


exports.connection = connection;
exports.insert = function(data){
  connection(data);
  console.log('data',data);
  log.verbose(data);

};
