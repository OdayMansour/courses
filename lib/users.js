// Not mine
const pool = require('./db')
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

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

module.exports.createUser_get = function (req, res) {
    res.send(
`<html>
  <body>
    <form action="/createuser/" method="post">
      <label for="username">Username: </label>
      <input id="username" type="text" name="username" value=""><br />
      <label for="firstname">First name: </label>
      <input id="firstname" type="text" name="firstname" value=""><br />
      <label for="lastname">Last name: </label>
      <input id="lastname" type="text" name="lastname" value=""><br />
      <label for="email">E-mail: </label>
      <input id="email" type="text" name="email" value=""><br />
      <label for="country">Country: </label>
      <input id="country" type="text" name="country" value=""><br />
      <label for="password">Password: </label>
      <input id="password" type="text" name="password" value=""><br />
      <input type="submit" value="OK">
    </form>
  </body>
</html>`
    )
}

function returnID(rows, req_res) {
    var req = req_res[0]
    var res = req_res[1]
    res.send("Congrats, user " + req.body.username + " created with id " + rows[0].id)
}

module.exports.createUser_post = function (req, res) {
    console.log(req.body)
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        pool.queryAndProcess(
            `INSERT INTO
                users (
                    username,
                    firstname,
                    lastname,
                    email,
                    country,
                    password
                )
            VALUES
                (
                $1,
                $2,
                $3,
                $4,
                $5,
                $6
                )
            RETURNING
                id`
            ,
            [
                req.body.username,
                req.body.firstname,
                req.body.lastname,
                req.body.email,
                req.body.country,
                hash
            ],
            returnID,
            [req, res]
        )
    })
}

