//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");



const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', true);

main().catch(err => console.log(err));

async function main(){
  await mongoose.connect(process.env.MONGODB_API_KEY);
};



const userSchema = new mongoose.Schema({
  email: String,
  password: String
});




userSchema.plugin(encrypt, { secret: process.env.SECRET_KEY , excludeFromEncryption: ['email'] });

const User = mongoose.model("Account", userSchema);

app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err){
    if(err){
      console.log(err);
    } else{
      res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  User.findOne({email: req.body.username}, function(err, foundUser){
    if(err){
      console.log(err);
    } else{
      if(foundUser.password === req.body.password){
        res.render("secrets");
      }
    }
  });
});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
})