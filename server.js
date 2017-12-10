const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const cookieParser = require('cookie-parser');
const session = require("express-session");
const FileStore = require('session-file-store')(session);
//const session = require("cookie-session");
const keys = require("./config/keys.js");
const GithubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const methodOverride = require("method-override");
const path = require("path");

const port = process.env.PORT || 3000  ;
const app = express();

app.use(express.static("public"));
//app.use('/dashboard/', express.static(path.join(__dirname, 'public')));
//app.use('/client/', express.static(path.join(__dirname, 'public')));
//app.use('/', express.static(path.join(__dirname, 'public')));

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

// Configure Passport...
//app.use(session({
//    maxAge: 1,
//    keys: [keys.session.cookieSecret]
//}));
app.use(cookieParser());
app.use(session({
  name: "server-session-cookie-id",
  secret: keys.session.cookieSecret,
  saveUninitialized: true,
  resave: true,
  store: new FileStore()
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "http://localhost:3000/auth/google/callback"
}, (accessToken, refreshToken, profile, done) => {
    // Look up user in database here?
    //console.log(profile);
    done(null, profile);
}));
passport.use(new GithubStrategy({
    clientID: keys.github.clientID,
    clientSecret: keys.github.clientSecret,
    callbackURL: "http://localhost:3000/auth/github/callback"
}, (accessToken, refreshToken, profile, done) => {
    // Look up user in database here?
    //console.log(profile);
    done(null, profile);
}));
passport.serializeUser( (user, done) => {
    //console.log("serializeUser:"+user.id)
    done(null, user);
});
passport.deserializeUser( (user, done) => {
    //console.log("deserializeUser:"+user.id)
    done(null, user);
});

// Set Handlebars.
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes
var routes = require("./controllers/BarberShop_controller.js");
var authRoutes = require("./routes/auth-routes.js");
authRoutes.setRoutes(passport);
app.use("/", routes);
app.use("/auth", authRoutes.router);

// log all requests to server
app.use(morgan("tiny"));


// listens for requests
app.listen(port, function() {
	console.log("Listening on PORT " + port);
});