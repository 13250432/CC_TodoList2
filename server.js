// requires
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const User = require("./models/User");

// setups
const app = express();

mongoose.connect(`${process.env.MONGODB_URI}`);

// Middleware
// set ejs as the view engine
app.set("view engine", "ejs");
// set json spaces to 4 (might be easier to read in curl outputs)
// https://expressjs.com/en/5x/api.html#app.set
app.set("json spaces", 4);

// use static directory 'public'
app.use(express.static("public"));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  session({
    secret: "SeCrEt",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// passport configuration
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return done(null, false);
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Routes
app.use("/", require("./routes/auth"));
app.use("/todos", require("./routes/todos"));
app.use("/api", require("./routes/api-create"),
                require("./routes/api-read"),
                require("./routes/api-edit"),
                require("./routes/api-delete"));

// handle 404 cases (webpage)
// put this under all the request stacks
app.use((req, res) => {
  console.log("404: request not found");
  res.status(404).render("index", {
    index: {
      title: "404",
      page: "not-found",
    },
  });
});

app.listen(process.env.PORT);
console.log(`listening on port: ${[process.env.PORT]}`);
