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
