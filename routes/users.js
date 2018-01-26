const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//load user model
require('../models/User');
const User = mongoose.model('users');

//register
router.get('/register', (req, res) =>{
  res.render('users/register');
});

//login
router.get('/login', (req, res) =>{
  res.render('users/login');
});

//post login

router.post("/login", (req, res, next) =>{
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//post register

router.post('/register', (req, res) => {
  let errors = [];
  if(req.body.password != req.body.password2){
    errors.push({text: "Password do not match"});
  }  
  if(req.body.password.length < 4){
    errors.push({text : "Password must be at least 4 chars"});
  }

  if(errors.length > 0){
    res.render('users/register', {
      name : req.body.name,
      email: req.body.email,
      password: res.body.password,
      password2: req.body.password2
    });
  }else{
    const newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }

    bcrypt.genSalt(10, (err, salt) =>{
      bcrypt.hash(newUser.password, salt, (err, hash) =>{
        if(err) throw err;
        newUser.password = hash;
        new User(newUser).save()
        .then(user => {
          req.flash('success_msg', 'You are now registered');
          res.redirect('/users/login');
        })
        .catch(err => {
          req.flash('error_msg', "Email already exists!");
          res.redirect('/users/register');
        });
      });
    });
  }
});


//logout user
router.get("/logout", (req, res)=>{
  req.logout();
  req.flash('success_msg', "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;