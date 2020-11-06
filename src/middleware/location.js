'use strict';
const getIP = require('ipware')().get_ip;
module.exports = (req, res, next) => {
  var ipInfo = getIP(req);
  console.log('yes', ipInfo);
  req.ipAddress = ipInfo.clientIp;
  // { clientIp: '127.0.0.1', clientIpRoutable: false }
  next();
};
