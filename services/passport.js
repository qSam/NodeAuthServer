const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//Create local strategy
const localOptions = {
  usernameField: 'email'
};
const localLogin = new LocalStrategy(localOptions, function(email, pass, done){
  // Verify username and password, call done with user
  // If incorrect call false;
  User.findOne({email: email}, function(err, user){
    if (err) { return done(err); }

    if(!user) { return done(null, false); }

    //Compare passwords
    

  });

});

// Setup options for JWT strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

//Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  // See if the user ID in the payload exists in our database
  // If it does, call done with user obect
  // otherwise, call done without a user object
  User.findByID(payload.sub, function(err,user){
    if (err) { return done(err,false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

//Tell passport to use this strategy
passport.use(jwtLogin);
