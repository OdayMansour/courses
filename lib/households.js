// Not mine
const pool = require('./db')

// Mine
const processor = require('./processor')
const lists = require('./lists')

module.exports.householdFromHouseholdid = function (req, res) {
    pool.queryAndProcess(
        'SELECT * FROM households WHERE id = $1', 
        [req.params.householdid], 
        processor.sendAsJSON, 
        res
    )
}

module.exports.usersFromHouseholdid = function (req, res) {
    pool.queryAndProcess(
        'SELECT id, username, firstname, lastname, email, country FROM users WHERE id IN (SELECT userid FROM user_household WHERE householdid = $1)', 
        [req.params.householdid], 
        processor.sendAsJSON, 
        res
    )
}

module.exports.listsFromHouseholdid = function (req, res) {
    pool.queryAndProcess(
        'SELECT * FROM lists WHERE userid IN (SELECT userid FROM user_household WHERE householdid = $1)', 
        [req.params.householdid], 
        processor.sendAsJSON, 
        res
    )
}

module.exports.fullListsFromHouseholdid = function (req, res) {
        pool.queryAndProcess(
        'SELECT id, name FROM lists WHERE userid IN (SELECT userid FROM user_household WHERE householdid = $1)',
        [req.params.householdid], 
        lists.fillLists,
        res
    )
}
