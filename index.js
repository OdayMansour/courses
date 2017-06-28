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
  queryAndProcess('SELECT * FROM users WHERE $1', ['TRUE'], justsend, res)
}

function oneUserFromUsername(req, res, username) {
  queryAndProcess('SELECT * FROM users WHERE username = $1', [username], justsend, res)
}

function oneUserFromUserid(req, res, userid) {
  queryAndProcess('SELECT * FROM users WHERE id = $1', [userid], justsend, res)
}

function householdUsers(req, res, householdid) {
  queryAndProcess('SELECT * FROM users WHERE id IN (SELECT userid FROM user_household WHERE householdid = $1)', [householdid], justsend, res)
}

function listUser(req, res, listid) {
  queryAndProcess('SELECT * FROM users WHERE id = (SELECT userid FROM lists WHERE id = $1)', [listid], justsend, res)
}

function getUser(req, res) {
  console.log("On /list")
  console.log(JSON.stringify(req.query))

  if (typeof req.query.username != 'undefined') {
    oneUserFromUsername(req, res, req.query.username)
  
  } else if (typeof req.query.userid != 'undefined') {
    oneUserFromUserid(req, res, req.query.userid)
  
  } else if (typeof req.query.householdid != 'undefined') {
    householdUsers(req, res, req.query.householdid)
  
  } else if (typeof req.query.listid != 'undefined') {
    listUser(req, res, req.query.listid)
  
  } else {
    allUsers(req, res)    
  }

}



// List stuff functions
function allLists(req, res) {
  queryAndProcess('SELECT * FROM lists WHERE $1', ['TRUE'], justsend, res)
}

function oneList(req, res, listid) {
  queryAndProcess('SELECT * FROM lists WHERE id = $1', [listid], justsend, res)
}

function userLists(req, res, userid) {
  queryAndProcess('SELECT * FROM lists WHERE userid = $1', [userid], justsend, res)
}

function householdLists(req, res, householdid) {
  queryAndProcess('SELECT * FROM lists WHERE userid IN (select userid from user_household WHERE householdid = $1)', [householdid], justsend, res)
}

function getList(req, res) {
  console.log("On /list")
  console.log(JSON.stringify(req.query))

  if (typeof req.query.listid != 'undefined') {
    oneList(req, res, req.query.listid)
  
  } else if (typeof req.query.userid != 'undefined') {
    userLists(req, res, req.query.userid)
  
  } else if (typeof req.query.householdid != 'undefined') {
    householdLists(req, res, req.query.householdid)
  
  } else {
    allLists(req, res)    
  }

}

app.get('/', nothing)

// User stuff
app.get('/user', getUser)

// List stuff
app.get('/list', getList)

// Item stuff
// app.get('/items', allItems)


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})