'use strict';
const authHelpers = require('../../../models/auth-helpers');

module.exports = (req, res, next) => {
  if(!req.cookies.token){
    throw new Error(`Access denied`);
  }else{
    authHelpers.authenticateToken(req.cookies.token).then((data)=>{
      console.log(data);
      next();
    }).catch(err =>{
      next(err);
    });
  }
  // if ((!req.body.email) || (!req.body.password)) {
  //   throw new Error(`Can't find email or password`);
  // } else {
  //   return authHelpers.authenticateBasic(req.body.email, req.body.password).then((validUser) => {
  //     req.token = authHelpers.generateToken(validUser);
  //     next();
  //   }).catch((err) => next(err));
  // }
};