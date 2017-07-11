// Not mine
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');

// Mine
const pool = require('../lib/db')

function checkPassword(user, password, done) {
    bcrypt.compare(password, user.password, function (err, res) {
        if (res == true) {
            console.log('correct')
            return done(null, user)
        } else {
            console.log('incorrect')
            return done(null, false, { message: 'Incorrect password.' });
        }
    })
}

module.exports = function(passport) {
    passport.use(new LocalStrategy(
        function(username, password, done) {
            pool.queryAndProcess(
                `select * from users where email = $1`,
                [username],
                function(rows) {
                    if (rows.length == 1) {
                        checkPassword(rows[0], password, done)
                        // if (password == 'asdf') {
                        //     return done(null, rows[0])
                        // } else {
                        //     return done(null, false, { message: 'Incorrect password.' });
                        // }
                    } else {
                        console.log('incorrect')
                        return done(null, false, { message: 'Incorrect email.' });
                    }
                },
                []
            )
        }
    ))

    passport.serializeUser(function(user, done) {
      done(null, user);
    })

    passport.deserializeUser(function(user, done) {
      done(null, user);
    })

}