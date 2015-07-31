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

function makeModel(){
  return {
    timestamp:           '',
    user:                '',
    filename:            '',
    description:         '',
    teacher_count:       '',
    teacher_ethnicities: '',
    student_ethnicities: '',
    activities:          '',
    technical_issues:    '',
    start_1:             '',
    stop_1:              '',
    usage_1:             '',
    notes_1:             '',
    start_2:             '',
    stop_2:              '',
    usage_2:             '',
    notes_2:             '',
    start_3:             '',
    stop_3:              '',
    usage_3:             '',
    notes_3:             '',
    start_4:             '',
    stop_4:              '',
    usage_4:             '',
    notes_4:             '',
    start_5:             '',
    stop_5:              '',
    usage_5:             '',
    notes_5:             '',
    start_6:             '',
    stop_6:              '',
    usage_6:             '',
    notes_6:             '',
    start_7:             '',
    stop_7:              '',
    usage_7:             '',
    notes_7:             '',
    start_8:             '',
    stop_8:              '',
    usage_8:             '',
    notes_8:             '',
    start_9:             '',
    stop_9:              '',
    usage_9:             '',
    notes_9:             '',
    start_10:            '',
    stop_10:             '',
    usage_10:            '',
    notes_10:            ''
  };
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
