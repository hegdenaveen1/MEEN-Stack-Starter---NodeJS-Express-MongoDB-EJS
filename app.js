var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");



mongoose.connect("mongodb://localhost/blahblah");


app.use(bodyParser.urlencoded({
     extended: true
})); 

app.set("view engine","ejs");


//Passport
app.use(require("express-session")({
	secret: "Lolololol ahaha",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});





app.get("/",function(req,res){
res.redirect("/login");
});


///Login

app.get("/login",function(req,res){
res.render("login");
});

app.post("/login",passport.authenticate("local", 
	{
		successRedirect: "/flag",
		failureRedirect: "/login"
	}), function(req,res){

});

//Logout
app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});




///Middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect("/login");
}




app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`));