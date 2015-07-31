function RawCodingForm(options){
  //use function call as constructor
  if (!(this instanceof RawCodingForm)) {
    return new RawCodingForm(options);
  }

  this = _.merge(this, options, {
    timestamp:             null
    , username:            null
    , file_name:           null
    , description:         null
    , teacher_count:       null
    , teacher_ethnicities: null
    , student_ethnicities: null
    , activities:          null
    , technical_issues:    null
    , start_1:             null
    , stop_1:              null
    , usage_1:             null
    , notes_1:             null
    , start_2:             null
    , stop_2:              null
    , usage_2:             null
    , notes_2:             null
    , start_3:             null
    , stop_3:              null
    , usage_3:             null
    , notes_3:             null
    , start_4:             null
    , stop_4:              null
    , usage_4:             null
    , notes_4:             null
    , start_5:             null
    , stop_5:              null
    , usage_5:             null
    , notes_5:             null
    , start_6:             null
    , stop_6:              null
    , usage_6:             null
    , notes_6:             null
    , start_7:             null
    , stop_7:              null
    , usage_7:             null
    , notes_7:             null
    , start_8:             null
    , stop_8:              null
    , usage_8:             null
    , notes_8:             null
    , start_9:             null
    , stop_9:              null
    , usage_9:             null
    , notes_9:             null
    , start_10:            null
    , stop_10:             null
    , usage_10:            null
    , notes_10:            null
  };
}

RawCodingForm.prototype.save = function save(options){

};

module.exports = RawCodingForm
