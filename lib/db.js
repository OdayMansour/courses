const pg = require('pg');
const config = require('../config/db.js')
 
//this initializes a connection pool 
//it will keep idle connections open for 30 seconds 
//and set a limit of maximum 10 idle clients 
const pool = new pg.Pool(config);
 
pool.on('error', function (err, client) {
  // if an error is encountered by a client while it sits idle in the pool 
  // the pool itself will emit an error event with both the error and 
  // the client which emitted the original error 
  // this is a rare occurrence but can happen if there is a network partition 
  // between your application and the database, the database restarts, etc. 
  // and so you might want to handle it and at least log it out 
  console.error('idle client error', err.message, err.stack);
});
 
//export the query method for passing queries to the pool 
module.exports.query = function (text, values, callback) {
  console.log('query:', text, values);
  return pool.query(text, values, callback);
};
 
// the pool also supports checking out a client for 
// multiple operations, such as a transaction 
module.exports.connect = function (callback) {
  return pool.connect(callback);
};

module.exports.queryAndProcess = function (qtext, qvalues, processor, args) {
  console.log(qtext)
  console.log(qvalues)
  pool.query(qtext, qvalues, function(err, result) {
    if(err) {
      console.error('error running query', err);
      return []
    }
    // return sender.send(JSON.stringify(result.rows));
    return processor(result.rows, args);
  });
}

module.exports.parametrize = function (arr) {
  var params = [];
    for(var i = 1; i <= arr.length; i++) {
      params.push('$' + i);
    }
  return params
}

module.exports.col = function (colname) {
  return function(x){return x[colname]}
}