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

module.exports.createHousehold_get = function (req, res) {
    res.send(
`<html>
  <body>
    <form action="/createhousehold/" method="post">
      <label for="householdName">Household name: </label>
      <input id="householdName" type="text" name="householdName" value=""><br />
      <label for="userId">User id (owner): </label>
      <input id="userId" type="text" name="userId" value=""><br />
      <input type="submit" value="OK">
    </form>
  </body>
</html>`
    )
}

module.exports.createHousehold_post = function (req, res) {
    console.log(req.body)
    pool.queryAndProcess(
        `INSERT INTO
            households (
                name,
                userid
            )
        VALUES
            (
            $1,
            $2
            )
        RETURNING
            id`
        ,
        [req.body.householdName, req.body.userId],
        returnID,
        [req, res]
    )
}

module.exports.join_get = function (req, res) {
    res.send(
`<html>
  <body>
    <form action="/api/households/join/" method="post">
      <label for="userId">User id: </label>
      <input id="userId" type="text" name="userId" value=""><br />
      <label for="householdId">Household id: </label>
      <input id="householdId" type="text" name="householdId" value=""><br />
      <input type="submit" value="OK">
    </form>
  </body>
</html>`
    )
}

module.exports.join_post = function (req, res) {
        pool.queryAndProcess( // Checking if list exsists before we add items to it
        `SELECT id FROM users WHERE id = $1`,
        [req.body.userId],
        checkUserToJoin,
        [req, res]
    )
}

module.exports.leave_get = function (req, res) {
    res.send(
`<html>
  <body>
    <form action="/api/households/leave/" method="post">
      <label for="userId">User id: </label>
      <input id="userId" type="text" name="userId" value=""><br />
      <label for="householdId">Household id: </label>
      <input id="householdId" type="text" name="householdId" value=""><br />
      <input type="submit" value="OK">
    </form>
  </body>
</html>`
    )
}

module.exports.leave_post = function (req, res) {
        pool.queryAndProcess( // Checking if list exsists before we add items to it
        `SELECT id FROM users WHERE id = $1`,
        [req.body.userId],
        checkUserToLeave,
        [req, res]
    )
}

function checkUserToLeave(rows, req_res) {
    var req = req_res[0]
    var res = req_res[1]

    if (rows.length == 1) { // User exists
        pool.queryAndProcess( // Checking if Household exists
            `SELECT id FROM households WHERE id = $1`,
            [req.body.householdId],
            checkHouseholdToLeave,
            [req, res]
        )
    } else {
        res.send('Invalid User id.')
    }
}

function checkHouseholdToLeave(rows, req_res) {
    var req = req_res[0]
    var res = req_res[1]

    if (rows.length == 1) { // Both User and Household exist
        pool.queryAndProcess(
            `SELECT userid, householdid FROM user_household WHERE userid = $1 AND householdid = $2`,
            [req.body.userId, req.body.householdId],
            checkUserHouseholdLink,
            [req, res]
        )
    } else {
        res.send('Invalid Household id')
    }
}

function checkUserHouseholdLink(rows, req_res) {
    var req = req_res[0]
    var res = req_res[1]

    if (rows.length == 1) { // User -> Household link exists
        pool.queryAndProcess(
            `DELETE FROM user_household WHERE userid = $1 AND householdid = $2`,
            [req.body.userId, req.body.householdId],
            function(rows) {
                res.redirect('/api/households/' + req.body.householdId)
            },
            [req, res]
        )
    } else {
        res.send('User ' + req.body.userId + ' is not a member of household ' + req.body.householdId + '. ')
    }
}

function returnHousehold(rows, req_res) { // Redirect to the list after insertion 
    var req = req_res[0]
    var res = req_res[1]

    res.redirect('/api/households/' + req.body.householdId + '/users')
}

function checkHouseholdToJoin(rows, req_res) {
        console.log(rows)
    var req = req_res[0]
    var res = req_res[1]

    if (rows.length == 1) { // Both User and Household exist
        pool.queryAndProcess(
            `INSERT INTO user_household (userid, householdid) VALUES ($1, $2)`,
            [req.body.userId, req.body.householdId],
            returnHousehold,
            [req, res]
        )
    }
}

function checkUserToJoin(rows, req_res) {
    console.log(rows)
    var req = req_res[0]
    var res = req_res[1]

    if (rows.length == 1) { // User exists
        pool.queryAndProcess( // Checking if Household exists
            `SELECT id FROM households WHERE id = $1`,
            [req.body.householdId],
            checkHouseholdToJoin,
            [req, res]
        )
    } else {
        res.send("Invalid User id.")
    }
}

function returnID(rows, req_res) {
    var req = req_res[0]
    var res = req_res[1]
    res.redirect('/api/households/' + rows[0].id)
}
