//var login = require('../login');
var User = require('../../models/UserModel');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport){

  //console.log('getting through');
  passport.serializeUser(function(user, done){
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });

  passport.use('login', new LocalStrategy({
    passReqToCallback: true
  },
  function(req, usernam, passwor, done){
    //console.log('in login process')
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ 'username': username },
      function(err, user){
        if(err) return done(err);
        if(!user) {
          console.log('User not found with username');
          return done(null, false, {'message': 'user not found'});
        }
        if(!isValidPassword(user, password)){
          console.log('Invalid Password');
          return done(null, false, {'message': 'Invalid Password'});
        }
        return done(null, user);
      });

  }));

  var isValidPassword = function(user, password){
    return bcrypt.compareSync(password, user.password);
  }

  passport.use('signup', new LocalStrategy({
    passReqToCallback: true
  },
  function(req, username, password, done){

    findOrCreateUser = function(){
      User.findOne({ 'username': req.username }, function(err, user){
        if(err){
          console.log('Error in SignUp: ', err);
          return done(err);
        }
        if(user){
          console.log('User already exists');
          return done(null, false, req.flash('message', 'User already exists'));
        } else {
          var newUser = new User();
          newUser.username = req.body.username;
          newUser.password = createHash(req.body.password);
          newUser.email = req.body.email;
          newUser.save(function(err){
            if(err){
              console.log('error in saving ', err);

            }
            console.log('User Registration successful');
            return done(null, newUser);
          });
        }
      });
    };
    process.nextTick(findOrCreateUser);
  }))

  var createHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  }


}
