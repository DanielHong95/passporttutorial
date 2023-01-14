const pool = require("./db");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
// const User = require("./users");
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  session({ secret: "secretcode", resave: true, saveUninitialized: true })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./passportconfig")(passport);

// routes
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) res.send("No User Exists");
    else {
      req.logIn(user, (err) => {
        if (err) throw err;
        res.send("Successfully Authenticated");
        console.log(req.user);
      });
    }
  })(req, res, next);
});

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM users WHERE email = $1`;
  const values = [email];
  try {
    const { rows } = await pool.query(sql, values);
    if (rows.length > 0) {
      res.send("User Already Exists");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = `INSERT INTO users(email, password) VALUES($1, $2) RETURNING *`;
      const values = [email, hashedPassword];
      const { rows } = await pool.query(sql, values);
      res.send("User Created");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating user" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    console.log(allUsers);
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// start server
app.listen(5000, () => {
  console.log("server has started on port 5000");
});
