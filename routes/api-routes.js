// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json(req.user);

    //res.json("/members"); - replace? AG

  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {

    console.log(req.body);

    db.User.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        console.log(err);
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        firstname: req.user.firstname,
        lastname: req.user.lastname,
        email: req.user.email,
        id: req.user.id,
      });
    }
  });
  //Get all users
  // app.get("/api/users", function (req, res) {
  //   db.User.findAll({}).then(function (dbUser) {
  //     res.json(dbUser);
  //   });
  // });

  //Get one user
  // app.get("/api/users/:id", function (req, res) {
  //   db.User.findOne({ where: { id: req.params.id } }).then(function (dbUser) {
  //     res.json(dbUser);
  //   });
  // });

  app.post("/api/newevent", function (req, res) {
    //res.sendFile(path.join(__dirname, "../public/members.html"));

    // post new event with sequelize here
    // event will be sent on the request body (req.body)
    //console.log("======= before create =======");
    //console.log(req.body);
    /**
     * {
        eventInput: 'asdf',
        dateInput: 'fdsa',
        timeInput: '1234',
        locationInput: '6543',
        descriptionInput: 'asdf',
        fullname: 'undefined undefined'
      }
     */
    db.Event.create({
      name: req.body.eventInput,
      eventDate: req.body.dateInput,
      time: req.body.timeInput,
      location: req.body.locationInput,
      description: req.body.descriptionInput,
      //email: req.body.email,
      fullname: req.body.fullname,
    })
      .then((dbEvent) => {
        //console.log(dbEvent);
        // res.render("newevent");
        res.redirect("/members");
      })
      .catch((err) => {
        res.status(501).json(err);
      });
  });
  // app.post("/api/newevent", function (req, res) {
  //   console.log(req.body);
  //   db.Event.create({
  //     name: req.body.eventInput,
  //     eventDate: req.body.dateInput,
  //     time: req.body.timeInput,
  //     location: req.body.locationInput,
  //     description: req.body.descriptionInput,
  //     email: req.body.email,
  //     fullname: req.body.fullname,
  //   }).then(function (dbEvent) {
  //     res.json(dbEvent);
  //   });
  // });
};
