'use strict';
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const authHelpers = require('../../../models/auth-helpers');

const CLIENT_ID = process.env.CLIENT_ID_FACEBOOK;
const CLIENT_SECRET = process.env.CLIENT_SECRET_FACEBOOK;

passport.use(
  new FacebookStrategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/oauth-facebook',
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
        };

        const check = await authHelpers.checkEmail(userRecord.email);
        if (check) {
          await authHelpers.authenticateBasic(userRecord.email, userRecord.password).then((validUser) => {
            const token = authHelpers.generateToken(validUser);
            //   next();
            return cb(null, { userData: validUser, token: token });
          });
          // .catch((err) => next(err));
        } else {
          const data = await authHelpers.signup(userRecord);
          const token = authHelpers.generateToken(data);
          //   next();
          return cb(null, { userData: data, token: token });
        }

        console.log(userRecord);
      } catch (error) {
        cb(error, false, error.message);
      }
    },
  ),
);

module.exports = passport;
