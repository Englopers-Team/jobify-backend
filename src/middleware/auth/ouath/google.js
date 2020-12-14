'use strict';
/* istanbul ignore file */

//------------------------------// Third Party Resources \\----------------------------\\
const superagent = require('superagent');

//---------------------------------// Import Resources \\-------------------------------\\
const authHelpers = require('../../../models/auth-helpers');

//--------------------------------// Esoteric Resources \\-------------------------------\\
const tokenServerUrl = 'https://oauth2.googleapis.com/token';
const remoteAPI = 'https://www.googleapis.com/oauth2/v2/userinfo';
const CLIENT_ID = process.env.CLIENT_ID_GOOGLE || '60556511916-bh8hf6uf6hoagsua5f5cbtnf9pnja6pu.apps.googleusercontent.com';
const CLIENT_SECRET = process.env.CLIENT_SECRET_GOOGLE || 'ETpj19SXp5ojaRRnNNPcIlqY';
const API_SERVER = 'https://jobify-app-v2.herokuapp.com/oauth-google';

//----------------------------------// Helper Function \\---------------------------------\\
async function exchangeCodeForToken(code) {
  let tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code',
  });
  let access_token = tokenResponse.body.access_token;
  return access_token;
}

async function getRemoteUserInfo(token) {
  let userResponse = await superagent.get(remoteAPI).set('user-agent', 'express-app').query({
    alt: 'json',
    access_token: token,
  });
  let user = userResponse.body;
  return user;
}

async function getUser(remoteUser) {
  let userRecord = {
    email: remoteUser.email,
    password: 'oauthpassword',
    account_type: 'p',
    first_name: remoteUser.given_name,
    last_name: remoteUser.family_name,
    phone: '079',
    country: 'jo',
    job_title: 'dev',
    oauth:true,
  };
  return userRecord;
}

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = async function authorize(req, res, next) {
  try {
    let code = req.query.code;
    let remoteToken = await exchangeCodeForToken(code);
    let remoteUser = await getRemoteUserInfo(remoteToken);
    let userRecord = await getUser(remoteUser);
    const check = await authHelpers.checkEmail(userRecord.email);
    if (check) {
      await authHelpers
        .authenticateBasic(userRecord.email, userRecord.password)
        .then(async (validUser) => {
          req.token = await authHelpers.generateToken(validUser);
          next();
        })
        .catch((err) => next(err));
    } else {
      const data = await authHelpers.signup(userRecord);
      req.token = await authHelpers.generateToken(data);
      next();
    }
  } catch (e) {
    next(`ERROR: ${e.message}`);
  }
};

//---------------------------------------------------------------------------------------\\
