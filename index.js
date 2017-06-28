const express = require('express')
const app = express()

const pool = require('./lib/db');
 
// Runs a query and processes results
function queryAndProcess(qtext, qvalues, processor, args) {
  pool.query(qtext, qvalues, function(err, result) {
    if(err) {
      console.error('error running query', err);
      return []
    }
    // return sender.send(JSON.stringify(result.rows));
    return processor(result.rows, args);
  });
}



// Processor stuff
// Processor that just sends results down the line
function justsend(rows, res) {
  res.send(JSON.stringify(rows));
}



// Generic stuff
function nothing(req, res) {
  res.send("Nothing to see here.")
}



// User stuff functions
function allUsers(req, res) {
  queryAndProcess('SELECT * FROM users where $1', ['TRUE'], justsend, res)
}

function oneUser(req, res) {
  queryAndProcess('SELECT * FROM users where username = $1', [req.query.username], justsend, res)
}



// List stuff functions
function allLists(req, res) {
  queryAndProcess('SELECT * FROM lists where $1', ['TRUE'], justsend, res)
}

function oneList(req, res) {
  queryAndProcess('SELECT * FROM lists where id = $1', [req.query.listid], justsend, res)
}

function userLists(req, res) {
  queryAndProcess('SELECT * FROM lists where userid = (select id from users where username = $1)', [req.query.username], justsend, res)
}

function householdLists(req, res) {
  queryAndProcess('SELECT * FROM lists where userid in (select userid from user_household where householdid = $1)', [req.query.householdid], justsend, res)
}



app.get('/', nothing)

// User stuff
app.get('/users', allUsers)
app.get('/user', oneUser)

// List stuff
app.get('/lists', allLists)
app.get('/list', oneList)
app.get('/userlists', userLists)
app.get('/householdlists', householdLists)



app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})