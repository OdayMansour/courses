module.exports.sendAsJSON = function (rows, res) {
  sendAsPrettyJSON(rows, res)
}

sendAsPrettyJSON = function (rows, res) {
  res.type('application/json')
  if (rows.length == 1) {
    res.send(JSON.stringify(rows[0], null, 2))
  } else {
    res.send(JSON.stringify(rows, null, 2))
  }
}
