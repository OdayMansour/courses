const express = require('express')
const app = express()

const pool = require('./lib/db')
 
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
function sendAsJSON(rows, res) {
  sendAsPrettyJSON(rows, res)
}

function sendAsPrettyJSON(rows, res) {
  res.type('application/json')
  res.send(JSON.stringify(rows, null, 2))
}



// Generic stuff
function nothing(req, res) {
  res.send("Nothing to see here.")
}



// User stuff functions
function allUsers(req, res) {
  queryAndProcess('SELECT * FROM users WHERE $1', ['TRUE'], sendAsJSON, res)
}

function oneUserFromUsername(req, res, username) {
  queryAndProcess('SELECT * FROM users WHERE username = $1', [username], sendAsJSON, res)
}

function oneUserFromUserid(req, res, userid) {
  queryAndProcess('SELECT * FROM users WHERE id = $1', [userid], sendAsJSON, res)
}

function householdUsers(req, res, householdid) {
  queryAndProcess('SELECT * FROM users WHERE id IN (SELECT userid FROM user_household WHERE householdid = $1)', [householdid], sendAsJSON, res)
}

function listUser(req, res, listid) {
  queryAndProcess('SELECT * FROM users WHERE id = (SELECT userid FROM lists WHERE id = $1)', [listid], sendAsJSON, res)
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
  queryAndProcess('SELECT * FROM lists WHERE $1', ['TRUE'], sendAsJSON, res)
}

function oneList(req, res, listid) {
  queryAndProcess('SELECT * FROM lists WHERE id = $1', [listid], sendAsJSON, res)
}

function userLists(req, res, userid) {
  queryAndProcess('SELECT * FROM lists WHERE userid = $1', [userid], sendAsJSON, res)
}

function householdLists(req, res, householdid) {
  queryAndProcess('SELECT * FROM lists WHERE userid IN (select userid from user_household WHERE householdid = $1)', [householdid], sendAsJSON, res)
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

// DB stuff helpers
function parametrize(arr) {
  var params = [];
    for(var i = 1; i <= arr.length; i++) {
      params.push('$' + i);
    }
  return params
}

function col(colname) {
  return function(x){return x[colname]}
}

function addItemsToLists(rows_listid_itemname, args) {
  var rows_listid_listname = args[0]
  var res = args[1]
  for (var i=0; i<rows_listid_listname.length; i++) {
    rows_listid_listname[i]['items'] = rows_listid_itemname.filter(function(x){return x.id == rows_listid_listname[i].id}).map(col('name'))
  }
  sendAsJSON({"list" : rows_listid_listname}, res)
}

function buildLists(rows_listid_listname, res) {
  // We just got fed an array of { id, name } refering to lists
  if (rows_listid_listname.length > 0) {
    queryAndProcess(
      `
        select 
          lists.id, 
          items.name 
        from 
          lists 
          join list_item on lists.id = list_item.listid 
          join items on list_item.itemid = items.id 
        where 
          lists.id in (` + parametrize(rows_listid_listname) + `);`,
      rows_listid_listname.map(col('id')), 
      addItemsToLists,
      [rows_listid_listname, res]
      )
  } else {
    sendAsJSON({}, res)
  }
}

function getFullLists(req, res) {
  console.log("On /fulllists")
  console.log(JSON.stringify(req.query))

  if (typeof req.query.userid != 'undefined') {
    queryAndProcess(
      'select lists.id, lists.name from lists where lists.userid = $1',
      [req.query.userid],
      buildLists,
      res)
  }
}

app.get('/', nothing)

// User stuff
app.get('/user', getUser)

// List stuff
app.get('/list', getList)

// Lists with full details
app.get('/fulllists', getFullLists)


// Item stuff
// app.get('/items', allItems)


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})