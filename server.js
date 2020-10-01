require("dotenv").config(); //AG
// Requiring necessary npm packages
var express = require("express");
var session = require("express-session");
// Requiring passport as we've configured it
var passport = require("./config/passport");
const path = require("path");

var db = require("./models");
// db.connect({
//   host: process.env.DB_HOST,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASS,
// });
var exphbs = require("express-handlebars"); //AG
// Creating express app and configuring middleware needed for authentication

var app = express();

var db = require("./models"); //AG
// Setting up port and requiring models for syncing

var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());

// Handlebars: code inserted by AG 9/21/20
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");

// Requiring our routes
require("./routes/api-routes.js")(app);
require("./routes/html-routes.js")(app);

// Syncing our database and logging a message to the user upon success
db.sequelize.sync({ force: false }).then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});
