'use strict';

//---------------------------------// Import The Resources \\-------------------------------\\
const authHelpers = require('../../../models/auth-helpers');

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = async (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    throw new Error(`Can't find email or password`);
  } else {
    return authHelpers
      .authenticateBasic(req.body.email, req.body.password)
      .then(async (validUser) => {
        req.token = await authHelpers.generateToken(validUser);
        next();
      })
      .catch((err) => {
        next(err);
      });
  }
};

//-----------------------------------------------------------------------------------------\\
