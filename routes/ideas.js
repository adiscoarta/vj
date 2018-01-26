const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//load auth helper
const {ensureAuthenticated} = require("../helpers/auth");

require('../models/Idea');
const Idea = mongoose.model('ideas');


//ideas
router.get('/', ensureAuthenticated, (req, res) =>{
    console.log(res.user);
  Idea.find({user: req.user.id})
  .sort({date:'desc'})
  .then(ideas =>{
      res.render('ideas/index', {
          ideas:ideas
      });
  });
  
});

//add ideas form
router.get('/add', ensureAuthenticated, (req, res) =>{
  res.render('ideas/add',
  {
      title: "",
      'details': ""
  }
  
  );
});

//edit idea
router.get('/edit/:id', ensureAuthenticated, (req, res) =>{
  console.log(req.params.id);
  Idea.findOne({
      _id: req.params.id,
      user: req.user.id
  })
  .then(idea =>{
    if(!idea){
        req.flash("error_msg", "Computer says no!");
        res.redirect("/ideas");
    }else{
        res.render('ideas/edit',
        {
            idea: idea
        }
        );
    }
  
  }).catch((error) => {
    req.flash("error_msg", "Computer says no!");
    res.redirect("/ideas");
    done();
  });
});

//process form
router.post('/', ensureAuthenticated, (req, res) =>{

  let errors = [];
  if(!req.body.title){
      errors.push({text: 'Empty tittle'});
  }

  if(!req.body.details){
      errors.push({text: "No details"});
  }

  if(errors.length > 0){
      res.render('ideas/add', {
          errors : errors,
          title: req.body.title,
          details: req.body.details
      })
  }else{
      const newUser = {
          title: req.body.title,
          details: req.body.details,
          user: req.user.id
      }
      new Idea(newUser).save()
      .then(idea=>{
          req.flash('success_msg', 'Idea added');
          res.redirect('/ideas');
      });
  }

});

// edit form process
router.put('/:id', ensureAuthenticated, (req, res) => {
  
  Idea.findById(req.params.id)
  .then(idea => {
      //change
      idea.title = req.body.title;
      idea.details = req.body.details;

      idea.save()
      .then(idea =>{
          req.flash('success_msg', 'Idea updated');
          res.redirect('/ideas');
      })
  }).catch(err=>{
      console.log(req.params.id);
      console.log('bubu');
  });
});

//delete idea
router.delete("/:id", ensureAuthenticated, (req, res) => {
  Idea.remove({_id : req.params.id})
  .then(()=>{
      req.flash('success_msg', 'Idea removed');
      res.redirect('/ideas');
  })
});

module.exports = router;