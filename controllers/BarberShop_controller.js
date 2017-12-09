const express = require("express");
const router = express.Router();
hbsObject = { dummy: "data"}


module.exports = function(passport) {
	// Create all our routes and set up logic within those routes where required.
	router.get("/", function(req, res) {
	    res.render("index", hbsObject);
	});

	router.get("/auth", passport.authenticate("github"));
	router.get("/auth/error", function(req, res){
		res.send("Login Failed");
	});
	router.get("/auth/callback",
		passport.authenticate("github", {failureRedirect: "/auth/error"}),
		function(req, res){
			res.send("Login success");
		}
	);

	return router;
}