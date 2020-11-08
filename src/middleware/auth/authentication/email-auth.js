'use strict';
const authHelpers = require('../../../models/auth-helpers');
const client = require('../../../models/database');

module.exports = (req, res, next) => {
  authHelpers
    .authenticateToken(req.cookies.token)
    .then(async (data) => {
      let SQL = `SELECT account_status FROM auth WHERE id=$1;`;
      let values = [data.id];
      let data2 = await client.query(SQL, values);
      let account_status = data2.rows[0].account_status;
      if (account_status == 'pending') {
        req.user = data;
        next();
      }
    })
    .catch((err) => {
      next(err);
    });
};
