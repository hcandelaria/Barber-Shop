const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const passport = require("passport");
const session = require("cookie-session");
const keys = require("./config/keys.js");
const GithubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const methodOverride = require("method-override");
const path = require("path");
const GithubStrategy = require("passport-github").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

var port = process.env.PORT || 3000  ;

var app = express();

app.use('/dashboard/', express.static(path.join(__dirname, 'public')));
app.use('/client/', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'public')));

// Sets up the Express app to handle data parsing
app.use(bodyParser.urlencoded({
	extended: false
}));

// Configure Passport...
app.use(session({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieSecret]
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new GoogleStrategy({
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: "http://localhost:3000/auth/google/callback"
}, function(accessToken, refreshToken, profile, done){
    // Look up user in database here?
    console.log(profile);
    done(null, {
        accessToken: accessToken,
        profile: profile
    });
}));
passport.use(new GithubStrategy({
    clientID: keys.github.clientID,
    clientSecret: keys.github.clientSecret,
    callbackURL: "http://localhost:3000/auth/github/callback"
}, function(accessToken, refreshToken, profile, done){
    // Look up user in database here?
    console.log(profile);
    done(null, {
        accessToken: accessToken,
        profile: profile
    });
}));
passport.serializeUser(function(user, done){
	//console.log("\n serializeUser: "+JSON.stringify(user));
    done(null, user.profile.id);
});
passport.deserializeUser(function(user, done){
	//console.log("\n deserializeUser: "+JSON.stringify(user));
    done(null, user);
});

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes
var routes = require("./routes/html-routes.js");

// log all requests to server
app.use(morgan('tiny'));

 // give the server access to them.
app.use("/", routes);

// listens for requests
app.listen(port, function() {
	console.log("Listening on PORT " + port);
});