const { Client } = require("pg");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

const client = new Client();

module.exports = function (passport) {
  passport.use(
    new localStrategy((email, password, done) => {
      client.query(
        "SELECT * FROM users WHERE email = $1",
        [email],
        (err, results) => {
          if (err) throw err;
          if (results.rowCount === 0) return done(null, false);
          const user = results.rows[0];
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        }
      );
    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    client.query("SELECT * FROM users WHERE id = $1", [id], (err, results) => {
      if (err) throw err;
      const user = results.rows[0];
      const userInformation = {
        email: user.email,
      };
      cb(err, userInformation);
    });
  });
};
