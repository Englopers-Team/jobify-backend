'use strict';

//---------------------------------// Import The Resources \\-------------------------------\\
const authHelpers = require('../../../models/auth-helpers');

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    throw new Error(`Can't find email or password`);
  } else {
    return authHelpers
      .authenticateBasic(req.body.email, req.body.password)
      .then((validUser) => {
        req.token = authHelpers.generateToken(validUser);
        next();
      })
      .catch((err) => next(err));
  }
};

//-----------------------------------------------------------------------------------------\\
