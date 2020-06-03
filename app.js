var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");



mongoose.connect("mongodb+srv://Naveen:abcde12345@bruteforce1cluster0-2zyxa.mongodb.net/test2?retryWrites=true&w=majority");
//mongodb://localhost/brute_force_login_challenge
//mongodb+srv://Naveen:abcde12345@bruteforce1cluster0-2zyxa.mongodb.net/test?retryWrites=true&w=majority

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



app.get("/flag",isLoggedIn, function(req,res){	
			res.render("flag");	
});



var newUser = new User({username: "Admin"});
	User.register(newUser,"Dolphin", function(err, user){
		if(err)
		{
			console.log(err);
			return res.render("login");
		}
		console.log("User Account Created");
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