'use strict';
/* istanbul ignore file */

//------------------------------// Third Party Resources \\----------------------------\\
const superagent = require('superagent');

//---------------------------------// Import Resources \\-------------------------------\\
const authHelpers = require('../../../models/auth-helpers');

//--------------------------------// Esoteric Resources \\-------------------------------\\
const tokenServerUrl = 'https://www.linkedin.com/oauth/v2/accessToken';
const remoteAPIemail = 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))';
const remoteAPIprofile = 'https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))';
const CLIENT_ID = process.env.CLIENT_ID_LINKEDIN || '77ja8aiam3pogu';
const CLIENT_SECRET = process.env.CLIENT_SECRET_LINKEDIN || 'QWiWlZa8Dmk28AT6';
const API_SERVER = 'https://jobify-app-v2.herokuapp.com/oauth-linkedin';

//----------------------------------// Helper Function \\---------------------------------\\
async function exchangeCodeForToken(code) {
  let tokenResponse = await superagent.post(tokenServerUrl).set('Host', 'www.linkedin.com').set('Content-Type', 'application/x-www-form-urlencoded').send({
    code: code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: API_SERVER,
    grant_type: 'authorization_code',
  });
  let access_token = tokenResponse.body.access_token;
  return access_token;
}

async function getRemoteUserInfo(token, remoteAPI) {
  let userResponse = await superagent.get(remoteAPI).set('user-agent', 'express-app').set('Authorization', `Bearer ${token}`);
  let user = userResponse.body;
  return user;
}

async function getUser(remoteUser) {
  let userRecord = {
    email: remoteUser.remoteUserEmail.elements[0]['handle~'].emailAddress,
    password: 'oauthpassword',
    account_type: 'p',
    first_name: remoteUser.remoteUserProfile.firstName.localized.en_US,
    last_name: remoteUser.remoteUserProfile.lastName.localized.en_US,
    phone: '079',
    country: 'jo',
    job_title: 'dev',
  };
  return userRecord;
}

module.exports = async function authorize(req, res, next) {
  try {
    let code = req.query.code;
    let remoteToken = await exchangeCodeForToken(code);
    let remoteUserProfile = await getRemoteUserInfo(remoteToken, remoteAPIprofile);
    let remoteUserEmail = await getRemoteUserInfo(remoteToken, remoteAPIemail);
    let remoteUser = { remoteUserProfile, remoteUserEmail };
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

//---------------------------------------------------------------------------------------\\
