// Not mine
const pool = require('./db')

// Mine
const processor = require('./processor')

module.exports.itemFromItemid = function(req, res) {
    pool.queryAndProcess(
        'SELECT * FROM items WHERE id = $1', 
        [req.params.itemid], 
        processor.sendAsJSON, 
        res
    )
}

module.exports.getItemIdFromName = function(itemname, processor, args) {
    pool.queryAndProcess( // Checking if item exists to see if we have to create it
        `SELECT id FROM items WHERE name = $1`,
        [itemname],
        processor,
        args
    )
}
