var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const exSession = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
var usersRouter = require("./routes/users");
const membersOnlyRoutes = require("./routes/membersOnly");
const bcrypt = require("bcryptjs");
const mongoDbUrl =
  "mongodb+srv://manikanth:manikanth@cluster0.jvz8p64.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const User = require("./schemas/users");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

passport.use(
  new localStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username }).exec();
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const sessionConnection = new MongoStore({
  mongoUrl: mongoDbUrl,
  collectionName: "sessions",
});
app.use(
  exSession({
    secret: "secret key",
    resave: false,
    saveUninitialized: true,
    store: sessionConnection,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // Eq 30 days
    },
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

app.use(passport.session());

app.use("/", membersOnlyRoutes);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

mongoose
  .connect(mongoDbUrl)
  .then(console.log("mongoDb connected successfully"))
  .catch((err) => console.log(err));

module.exports = app;
