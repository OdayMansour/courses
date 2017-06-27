const express = require('express')
const app = express()

const pool = require('./lib/db');
 
//to run a query we just pass it to the pool 
//after we're done nothing has to be taken care of 
//we don't have to return any client to the pool or close a connection 

app.get('/', function (req, res) {

    res.send("This is nothing.")

})

app.get('/users', function (req, res) {
    
    pool.query('SELECT * FROM users where $1', ['TRUE'], function(err, result) {
      if(err) {
        return console.error('error running query', err);
      }
      return res.send(JSON.stringify(result.rows));
    });

})

app.get('/user', function (req, res) {
    
    pool.query('SELECT * FROM users where username = $1', [req.query.username], function(err, result) {
      if(err) {
        return console.error('error running query', err);
      }
      return res.send(JSON.stringify(result.rows));
    });

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})