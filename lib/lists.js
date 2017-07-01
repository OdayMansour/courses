// Not mine
const pool = require('./db')

// Mine
const processor = require('./processor')

module.exports.listFromListid = function(req, res) {
    pool.queryAndProcess(
        'SELECT * FROM lists WHERE id = $1', 
        [req.params.listid], 
        processor.sendAsJSON, 
        res
    )
}

module.exports.fullListFromListid = function(req, res) {
    pool.queryAndProcess(
        'SELECT id, name FROM lists WHERE id = $1',
        [req.params.listid], 
        fillLists,
        res
    )
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
module.exports.fillLists = fillLists

function buildListJson(rows_listid_itemname, args) {
  var rows_listid_listname = args[0]
  var res = args[1]
  for (var i=0; i<rows_listid_listname.length; i++) {
    rows_listid_listname[i]['items'] = rows_listid_itemname.filter(function(x){return x.id == rows_listid_listname[i].id}).map(pool.col('name'))
  }
  processor.sendAsJSON({"list" : rows_listid_listname}, res)
}
