'use strict';
const authHelpers = require('../../../models/auth-helpers');

module.exports = (req, res, next) => {
  if(!req.cookies.token){
    throw new Error(`Access denied`);
  }else{
    authHelpers.authenticateToken(req.cookies.token).then(()=>{
      next();
    }).catch(err =>{
      next(err);
    });
  }

};