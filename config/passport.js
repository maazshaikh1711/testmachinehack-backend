const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Configure the local strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username , password, done) => {
      try {
        // Find the user by email
        const user = await User.findOne({ username  });
        if (!user) {
          return done(null, false, { message: 'User not found' });
        }

        // Check if the password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return done(null, false, { message: 'Invalid password' });
        }

        // If successful, return the user
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

module.exports = passport;
