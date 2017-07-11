module.exports.login_post = function(passport) {
    return passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' })
}

module.exports.login_get = function(req, res) {
res.send(
`<html>
  <body>
    <form action="/login" method="post">
      <label>E-mail:</label>
      <input type="text" name="username"/>
      <label>Password:</label>
      <input type="password" name="password"/>
      <input type="submit" value="Log In"/>
    </form>
  </body>
</html>`)
}
