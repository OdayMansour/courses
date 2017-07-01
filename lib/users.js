// Not mine
const pool = require('./db')

// Mine
const processor = require('./processor')
const lists = require('./lists')

module.exports.userFromUserid = function (req, res) {
    pool.queryAndProcess(
        'SELECT id, username, firstname, lastname, email, country FROM users WHERE id = $1', 
        [req.params.userid], 
        processor.sendAsJSON, 
        res
    )
}

module.exports.listsFromUserid = function (req, res) {
    pool.queryAndProcess(
        'SELECT * FROM lists WHERE userid = $1', 
        [req.params.userid], 
        processor.sendAsJSON, 
        res
    )
}

module.exports.householdsFromUserid = function (req, res) {
    pool.queryAndProcess(
        'SELECT * FROM households WHERE id IN (SELECT householdid FROM user_household WHERE userid = $1)', 
        [req.params.userid], 
        processor.sendAsJSON, 
        res
    )
}

module.exports.fullListsFromUserid = function (req, res) {
        pool.queryAndProcess(
        'SELECT id, name FROM lists WHERE userid = $1',
        [req.params.userid], 
        lists.fillLists,
        res
    )
}
