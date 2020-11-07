'use strict';
const superagent = require('superagent');
const client = require('../models/database');

class Helper {
  constructor() {}

  async location(ip) {
    try {
      if (ip == '' || ip == '::1') {
        ip = '95.172.208.217';
      }
      let URL = `https://api.ip2country.info/ip?${ip}`;
      let countryName = await superagent.get(URL);
      return countryName.body.countryName == '' ? 'Jordan' : countryName.body.countryName;
    } catch (error) {
      ('Invalid Location');
    }
  }

  async flag(ip) {
    if (ip == '' || ip == '::1') {
      ip = '95.172.208.217';
    }
    let URL = `https://api.ip2country.info/ip?${ip}`;
    let data = await superagent.get(URL);
    let countryCode = data.body.countryCode == '' ? 'JO' : data.body.countryCode;
    let flag = `https://www.countryflags.io/${countryCode}/Shiny/64.png`;
    return flag;
  }

  async sendReport(user, payload) {
    let report = payload.description;
    let SQL = `INSERT INTO admin_reports (description, response, auth_id) VALUES ($1,$2,$3);`;
    let value = [report, null, user.id];
    await client.query(SQL, value);
  }

  pdfScanner(file) {}

  api() {
    // get all jobs from database
  }
}

module.exports = new Helper();
