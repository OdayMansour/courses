// Not mine
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

// Mine
const pool = require('./lib/db')
const processor = require('./lib/processor')
const users = require('./lib/users')
const lists = require('./lib/lists')
const items = require('./lib/items')
const households = require('./lib/households')

// Configuring Express app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'))

// Paths
app.get('/', nothing)
app.get('/createuser', function (req, res) {
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

})
app.post('/createuser', function (req, res) {
  res.send(JSON.stringify(req.body, null, 2))
})

// Routers
var routerUsers = express.Router()
var routerLists = express.Router()
var routerItems = express.Router()
var routerHouseholds = express.Router()

// Assigning routers
app.use('/users', routerUsers)
app.use('/lists', routerLists)
app.use('/items', routerItems)
app.use('/households', routerHouseholds)

// Users stuff
routerUsers.get('/:userid', users.userFromUserid)
routerUsers.get('/:userid/lists', users.listsFromUserid)
routerUsers.get('/:userid/lists/full', users.fullListsFromUserid)
routerUsers.get('/:userid/households', users.householdsFromUserid)

// Lists stuff
routerLists.get('/:listid', lists.listFromListid)
routerLists.get('/:listid/full', lists.fullListFromListid)

// Item stuff
routerItems.get('/:itemid', items.itemFromItemid)

// Households stuff
routerHouseholds.get('/:householdid', households.householdFromHouseholdid)
routerHouseholds.get('/:householdid/users', households.usersFromHouseholdid)
routerHouseholds.get('/:householdid/lists', households.listsFromHouseholdid)
routerHouseholds.get('/:householdid/lists/full', households.fullListsFromHouseholdid)


// Generic stuff
function nothing(req, res) {
  res.send("Nothing to see here.")
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})