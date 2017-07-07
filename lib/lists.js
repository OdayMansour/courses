// Not mine
const pool = require('./db')

// Mine
const processor = require('./processor')
const items = require('./items')

module.exports.listFromListid = function(req, res) {
    pool.queryAndProcess(
        'SELECT * FROM lists WHERE id = $1', 
        [req.params.listid], 
        processor.sendAsJSON, 
        res
    )
}

module.exports.fullListFromListid = function (req, res) {
    pool.queryAndProcess(
        'SELECT id, name FROM lists WHERE id = $1',
        [req.params.listid], 
        fillLists,
        res
    )
}

module.exports.fillLists = fillLists

// Adding an item to a list

module.exports.addItem_get = function (req, res) {
    res.send(
`<html>
  <body>
    <form action="/api/lists/additem/" method="post">
      <label for="listId">List id: </label>
      <input id="listId" type="text" name="listId" value=""><br />
      <label for="itemName">Item name: </label>
      <input id="itemName" type="text" name="itemName" value=""><br />
      <input type="submit" value="OK">
    </form>
  </body>
</html>`
    )
}

module.exports.addItem_post = function (req, res) {
    console.log(req.body)
    pool.queryAndProcess( // Checking if list exsists before we add items to it
        `SELECT id FROM lists WHERE id = $1`,
        [req.body.listId],
        checkListToAdd,
        [req, res]
    )
}

// Deleting an item from a list

module.exports.delItem_post = function (req, res) {
    console.log(req.body)
    items.getItemIdFromName(req.body.itemName, checkItemToDelete, [req, res])
}

module.exports.delItem_get = function (req, res) {
    res.send(
`<html>
  <body>
    <form action="/api/lists/delitem/" method="post">
      <label for="listId">List id: </label>
      <input id="listId" type="text" name="listId" value=""><br />
      <label for="itemName">Item name: </label>
      <input id="itemName" type="text" name="itemName" value=""><br />
      <input type="submit" value="OK">
    </form>
  </body>
</html>`
    )
}

// Creating a list

module.exports.create_get = function (req, res) {
    res.send(
`<html>
  <body>
    <form action="/api/lists/create/" method="post">
      <label for="userId">User id: </label>
      <input id="userId" type="text" name="userId" value=""><br />
      <label for="listName">List name: </label>
      <input id="listName" type="text" name="listName" value=""><br />
      <input type="submit" value="OK">
    </form>
  </body>
</html>`
    )
}

module.exports.create_post = function (req, res) {
    pool.queryAndProcess(
        `SELECT id FROM users WHERE id = $1`,
        [req.body.userId],
        checkUserToCreate,
        [req, res]
    )
}

// Deleting a list

module.exports.delete_get = function (req, res) {
    res.send(
`<html>
  <body>
    <form action="/api/lists/delete/" method="post">
      <label for="listId">List id: </label>
      <input id="listId" type="text" name="listId" value=""><br />
      <input type="submit" value="OK">
    </form>
  </body>
</html>`
    )
}

module.exports.delete_post = function (req, res) {
    pool.queryAndProcess(
        `SELECT id FROM lists WHERE id = $1`,
        [req.body.listId],
        checkListToDelete,
        [req, res]
    )
}

// Callbacks and workflow steps

function checkListToDelete(rows, req_res) {
    var req = req_res[0]
    var res = req_res[1]

    if (rows.length == 1) { // List exists
        pool.queryAndProcess(
            `DELETE FROM lists WHERE id = $1`,
            [req.body.listId],
            deleteListLinks,
            [req, res]
        )
    } else {
        res.send('Invalid listId ' + req.body.listId + '. ')
    }
}

function deleteListLinks(rows, req_res) {
    var req = req_res[0]
    var res = req_res[1]

    pool.queryAndProcess(
        `DELETE FROM list_item WHERE listid = $1`,
        [req.body.listId],
        function(rows) {
            res.send('Deleted list ' + req.body.listId + ' and all links.')
        },
        [req, res]
    )    
}

function checkUserToCreate(rows, req_res) {
    var req = req_res[0]
    var res = req_res[1]

    if (rows.length == 1) { // User exsists
        pool.queryAndProcess(
            `INSERT INTO lists (name, userid) VALUES ($1, $2) RETURNING id`,
            [req.body.listName, req.body.userId],
            function(rows) {
                res.redirect('/api/lists/' + rows[0].id + '/full')
            },
            [req, res]
        )
    } else {
        res.send("Invalid User id.")
    }
}

function checkListItemLink(rows, req_res) {
    var req = req_res[0]
    var res = req_res[1]

    if (rows.length == 1) { // Link between list and item exists
        pool.queryAndProcess(
            `DELETE FROM list_item WHERE listid = $1 AND itemid = $2`,
            [rows[0].listid, rows[0].itemid],
            function(rows) {
                res.redirect('/api/lists/' + req.body.listId + '/full')
            },
            [req, res]
        )
    } else {
        res.send('Invalid List -> Item link.')
    }
}

function checkItemToDelete(rows, req_res) {
    var req = req_res[0]
    var res = req_res[1]

    if (rows.length == 1) { // Item exists and we have its ID now
        pool.queryAndProcess(
            `SELECT 
                listid, 
                itemid 
            FROM 
                list_item 
            WHERE 
                listid = (SELECT id FROM lists WHERE id = $1) AND 
                itemid = (SELECT id FROM items WHERE id = $2);`,
            [req.body.listId, rows[0].id],
            checkListItemLink,
            [req, res]
        )
    } else {
        res.send('Item ' + req.body.itemName + ' does not exist in the system.')
    }
    

}

function returnList(rows, req_res) { // Redirect to the list after insertion 
    var req = req_res[0]
    var res = req_res[1]

    res.redirect('/api/lists/' + req.body.listId + '/full')
}

function linkItemToList(rows, req_res) {
    var req = req_res[0]
    var res = req_res[1]

    pool.queryAndProcess( // Create the link in the DB between list and item
        `INSERT INTO list_item (listid, itemid) VALUES ($1, $2)`,
        [
            req.body.listId,
            rows[0].id
        ],
        returnList,
        [req, res]
    )
}

function addExistingItemToList(rows, req_res) { // Just a wrapper for future developments
    linkItemToList(rows, req_res)
}

function addNewItemToList(req_res) {
    var req = req_res[0]
    var res = req_res[1]
    
    pool.queryAndProcess( // Create item and get its ID to be used later to link it to the list
        `INSERT INTO items (name) values ($1) RETURNING id`,
        [req.body.itemName],
        linkItemToList,
        [req, res]
    )
}

function checkItemToAdd(rows, req_res) {
    var req = req_res[0]
    var res = req_res[1]

    if (rows.length == 1) { // Item exists and we can link it directly using the returned ID
        addExistingItemToList(rows, req_res)
    } else { // Item does not exist and we need to create it first
        addNewItemToList(req_res)
    }
}

function checkListToAdd(rows, req_res) {
    var req = req_res[0]
    var res = req_res[1]

    if (rows.length == 1) { // List exists
        items.getItemIdFromName(req.body.itemName, checkItemToAdd, [req, res])
    } else {
        res.send("Invalid list choice.")
    }
}

function buildListJson(rows_listid_itemname, args) {
  var rows_listid_listname = args[0]
  var res = args[1]
  for (var i=0; i<rows_listid_listname.length; i++) {
    rows_listid_listname[i]['items'] = rows_listid_itemname.filter(function(x){return x.id == rows_listid_listname[i].id}).map(pool.col('name'))
  }
  processor.sendAsJSON({"list" : rows_listid_listname}, res)
}

function fillLists(rows_listid_listname, res) {
    pool.queryAndProcess(
        `SELECT 
            lists.id,
            items.name 
        FROM 
            lists
            JOIN list_item ON lists.id = list_item.listid 
            JOIN items ON list_item.itemid = items.id
        WHERE
            lists.id in (` + pool.parametrize(rows_listid_listname) + `)`,
        rows_listid_listname.map(pool.col('id')),
        buildListJson,
        [rows_listid_listname, res]
    )
}
