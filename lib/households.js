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

function returnID(rows, res_req) {
    var res = res_req[0]
    var req = res_req[1]
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
        [res, req]
    )
}
