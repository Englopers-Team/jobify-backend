'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const getIP = require('ipware')().get_ip;

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = (req, res, next) => {
  var ipInfo = getIP(req);
  console.log('yes', ipInfo);
  req.ipAddress = ipInfo.clientIp;
  next();
};

//-----------------------------------------------------------------------------------------\\