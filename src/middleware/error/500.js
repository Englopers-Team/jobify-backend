'use strict';

module.exports = (err, req, res, next) => {
  res.status(500);
  res.statusMessage = 'Server Error';
  let error = err.message ? err.message : err;
  res.json({ error });
};
