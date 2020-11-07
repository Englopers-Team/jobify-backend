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
      return countryName.body.countryName == ''
        ? 'Jordan'
        : countryName.body.countryName;
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
    let countryCode =
      data.body.countryCode == '' ? 'JO' : data.body.countryCode;
    let flag = `https://www.countryflags.io/${countryCode}/Shiny/64.png`;
    return flag;
  }

  async getID(authID, table) {
    const SQL = `SELECT id FROM ${table} WHERE auth_id=$1`;
    const values = [authID];
    const result = await client.query(SQL, values);
    return result.rows[0].id;
  }

  async getAuthID(id, table) {
    const SQL = `SELECT auth_id FROM ${table} WHERE id=$1`;
    const values = [id];
    const result = await client.query(SQL, values);
    console.log(result.rows[0]);
    return result.rows[0].auth_id;
  }

  pdfScanner(file) {}

  api() {
    // get all jobs from database
  }
}

module.exports = new Helper();
