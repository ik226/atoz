var express = require('express');
var router = express.Router();

//TODO: setup redirect

module.exports = function(passport){
  router.post('/login', passport.authenticate('login', {
    //successRedirect: '/',
    //failureRedirect: '/',
    //failureFlash: true
  }),function(req, res){
    //console.log(user)
    //if(err ) res.statusCode(500).send('something wrong with login auth');
    //res.status(200).send();
    res.redirect('/')
  });

  router.post('/signup', passport.authenticate('signup', {
    //successRedirect: '/',
    //failureRedirect: '/signup',
    //failtureFlash: true
  }), function(req, res){
    //console.log(req.body);
    res.send('get through authenticate');
  });

  //test
  router.get('/signup', function(req, res){
    res.send('route works..');
  })

  router.get('/logout', function(req, res){
    req.logout();
    res.send('logout successfully')
  })


  return router;
}
