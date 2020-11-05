'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || 'z1337z';

class AuthHelper{
  constructor(){

  }

  signup(payload){
    
  }

  authenticateBasic(username, password){

  }

  generateToken(user){

  }

  authenticateToken(token){

  }

}

module.exports = new AuthHelper();