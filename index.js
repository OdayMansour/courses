// Not mine
const express = require('express')
const app = express()

// Mine
const pool = require('./lib/db')
const processor = require('./lib/processor')
const users = require('./lib/users')
const lists = require('./lib/lists')
const items = require('./lib/items')
const households = require('./lib/households')

// Paths
app.get('/', nothing)

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