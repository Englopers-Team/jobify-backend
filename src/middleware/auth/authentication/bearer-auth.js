'use strict';

//---------------------------------// Import The Resources \\-------------------------------\\
const authHelpers = require('../../../models/auth-helpers');
const client = require('../../../models/database');

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = (req, res, next) => {
  if (!req.headers.authorization) {
    throw new Error(`Access denied`);
  } else {
    const token = req.headers.authorization.split(' ').pop();
    authHelpers
      .authenticateToken(token)
      .then(async (data) => {
        let SQL = `SELECT account_status FROM auth WHERE id=$1;`;
        let values = [data.id];
        let data2 = await client.query(SQL, values);
        let account_status = data2.rows[0].account_status;
        if (account_status == 'active') {
          req.user = data;
          next();
        } else if (account_status == 'pending') {
          req.user = data;
          next();
          // throw new Error(`Your account is not active please verify your email`);
        } else {
          next();
          // throw new Error(`You are banned`);
        }
      })
      .catch((err) => {
        next(err);
      });
  }
};

//-----------------------------------------------------------------------------------------\\
