

module.exports.sendAsJSON = function (rows, res) {
  sendAsPrettyJSON(rows, res)
}

sendAsPrettyJSON = function (rows, res) {
  res.type('application/json')
  res.send(JSON.stringify(rows, null, 2))
}
