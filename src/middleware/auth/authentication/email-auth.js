'use strict';
const authHelpers = require('../../../models/auth-helpers');
const client = require('../../../models/database');

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(' ').pop();
  authHelpers.authenticateToken(token).then(async (data) => {
    let SQL = `SELECT account_status FROM auth WHERE id=$1;`;
    let values = [data.id];
    let data2 = await client.query(SQL, values);
    let account_status = data2.rows[0].account_status;
    if (account_status == 'pending') {
      req.user = data;
      req.accountStatus = 'pending';
      next();
    } else if (account_status == 'blocked') {
      req.user = data;
      req.accountStatus = 'blocked';
      next();
    } else if (account_status == 'active'){
      req.user = data;
      req.accountStatus = 'active';
      next();
    }else{
      next();
    }
  });
};
