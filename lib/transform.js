var _       = require('lodash')
  , log     = require('./log')(module)
  , config  = require('./config')
  ;

function normalizeKey(v,k){
  return _.chain(k)
    .snakeCase()
    .value()
    ;
}

module.exports = function(data){

  var temp = _.chain(data)
    .mapKeys(normalizeKey)
    .pick([
      'timestamp'
      , 'username'
      , 'file_name'
      , 'description'
      , 'teacher_count'
      , 'teacher_ethnicities'
      , 'student_ethnicities'
      , 'activities'
      , 'technical_issues'
    ])
    .value()
    ;
  log.info(temp);
  return temp;

};
