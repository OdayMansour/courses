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
      <input type="submit" value="OK">
    </form>
  </body>
</html>`
    )
}

function returnID(rows, req_res) {
    var req = req_res[0]
    var res = req_res[1]
    res.send("Congrats, household " + req.body.householdName + " created with id " + rows[0].id)
}

module.exports.createHousehold_post = function (req, res) {
    console.log(req.body)
    pool.queryAndProcess(
        `INSERT INTO
            households (
                name
            )
        VALUES
            (
            $1
            )
        RETURNING
            id`
        ,
        [req.body.householdName],
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

function returnHousehold(rows, req_res) { // Redirect to the list after insertion 
    var req = req_res[0]
    var res = req_res[1]

    res.redirect('/api/households/' + req.body.householdId + '/users')
}

function checkHousehold(rows, req_res) {
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

function checkUser(rows, req_res) {
    console.log(rows)
    var req = req_res[0]
    var res = req_res[1]

    if (rows.length == 1) { // User exists
        pool.queryAndProcess( // Checking if Household exists
            `SELECT id FROM households WHERE id = $1`,
            [req.body.householdId],
            checkHousehold,
            [req, res]
        )
    } else {
        res.send("Invalid User id.")
    }
}

module.exports.join_post = function (req, res) {
        pool.queryAndProcess( // Checking if list exsists before we add items to it
        `SELECT id FROM users WHERE id = $1`,
        [req.body.userId],
        checkUser,
        [req, res]
    )
}
