'use strict';
const superagent = require('superagent');

class Helper {
  constructor() {

  }

  location(req) {
    let ip =
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null) || '127.0.0.1';
    if (ip == '') {
      ip = '127.0.0.1';
    }
    let URL = `https://api.ip2country.info/ip?${ip}`;
    return superagent.get(URL).then((data) => {
      if (data.body.countryName == '') {
        return 'Jordan';
      } else return data.body.countryName;
    })
      .catch(() => {
        console.log('error API || ip ');
      });
  }

  pdfScanner(file){
    
  }

  api(){
    // get all jobs from database
  }

}

module.exports = new Helper();