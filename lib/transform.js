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

module.exports = function(data,meta){
  // log.info('transform: ',data);

  var temp = _.chain(data)
    .mapValues(function(v,k){
      if(_.isArray(v)){
        return v.join('; ');
      }
      else{
        return v;
      }
    })
    .mapKeys(normalizeKey)
    .omit([
      'add_more_usages'
    ])
    .merge({
      meta: JSON.stringify(meta)
    })
    .value()
    ;
  // log.info('transform: ',temp);
  return temp;

};
