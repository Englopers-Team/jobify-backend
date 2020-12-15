'use strict';
/* istanbul ignore file */

//------------------------------// Third Party Resources \\----------------------------\\
const passport = require('passport');

//---------------------------------// Import Resources \\-------------------------------\\
const FacebookStrategy = require('passport-facebook').Strategy;
const authHelpers = require('../../../models/auth-helpers');

//--------------------------------// Esoteric Resources \\-------------------------------\\
const CLIENT_ID = process.env.CLIENT_ID_FACEBOOK || '3764129010266543';
const CLIENT_SECRET = process.env.CLIENT_SECRET_FACEBOOK || 'a01a2595620ed60e2ff43d7442af3be4';

//---------------------------------// Passport Oauth \\-------------------------------\\

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: 'https://jobify-app-v2.herokuapp.com/oauth-facebook',
      profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
    },

    async function (accessToken, refreshToken, profile, cb) {
      try {
        let userRecord = {
          email: profile['_json'].email,
          password: 'oauthpassword',
          account_type: 'p',
          first_name: profile['_json'].first_name,
          last_name: profile['_json'].last_name,
          phone: '079',
          country: 'jo',
          job_title: 'dev',
          oauth:true,
        };
        const check = await authHelpers.checkEmail(userRecord.email);
        if (check) {
          await authHelpers.authenticateBasic(userRecord.email, userRecord.password).then(async (validUser) => {
            const token = await authHelpers.generateToken(validUser);
            return cb(null, { userData: validUser, token: token });
          });
        } else {
          const data = await authHelpers.signup(userRecord);
          const token = await authHelpers.generateToken(data);
          return cb(null, { userData: data, token: token });
        }
      } catch (error) {
        cb(error, false, error.message);
      }
    },
  ),
);

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = passport;

//---------------------------------------------------------------------------------------\\
