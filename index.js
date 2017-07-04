// Not mine
const express = require('express')
const bodyParser = require('body-parser');
const app = express()

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

app.get('/createuser', users.createUser_get)
app.post('/createuser', users.createUser_post)

app.get('/createhousehold', households.createHousehold_get)
app.post('/createhousehold', households.createHousehold_post)


// Routers
var routerUsers = express.Router()
var routerLists = express.Router()
var routerItems = express.Router()
var routerHouseholds = express.Router()

// Assigning routers
app.use('/api/users', routerUsers)
app.use('/api/lists', routerLists)
app.use('/api/items', routerItems)
app.use('/api/households', routerHouseholds)

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