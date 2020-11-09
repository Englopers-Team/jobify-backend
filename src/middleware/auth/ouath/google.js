'use strict';

const superagent = require('superagent');
const authHelpers = require('../../../models/auth-helpers');

const tokenServerUrl = 'https://oauth2.googleapis.com/token';
const remoteAPI = 'https://www.googleapis.com/oauth2/v2/userinfo';
const CLIENT_ID = process.env.CLIENT_ID_GOOGLE || '845374033514-cipcled8idbs9bg1qml9agt38bbappek.apps.googleusercontent.com';
const CLIENT_SECRET = process.env.CLIENT_SECRET_GOOGLE || '6I86RhRUr09bL2feCmDqiGDx';
const API_SERVER = 'http://localhost:3000/oauth-google';

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
        .then((validUser) => {
          req.token = authHelpers.generateToken(validUser);
          next();
        })
        .catch((err) => next(err));
    } else {
      const data = await authHelpers.signup(userRecord);
      req.token = authHelpers.generateToken(data);
      next();
    }
  } catch (e) {
    next(`ERROR: ${e.message}`);
  }
};

async function exchangeCodeForToken(code) {
  let tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code',
  });

  let access_token = tokenResponse.body.access_token;
  console.log(access_token);

  return access_token;
}

async function getRemoteUserInfo(token) {
  let userResponse = await superagent.get(remoteAPI).set('user-agent', 'express-app').query({
    alt: 'json',
    access_token: token,
  });

  let user = userResponse.body;
  console.log(user);
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
  };
  console.log(userRecord);
  return userRecord;
}
