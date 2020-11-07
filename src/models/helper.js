'use strict';
const superagent = require('superagent');
const client = require('../models/database');
const faker = require('faker');

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

  async sendReport(user, payload) {
    let report = payload.description;
    let SQL = `INSERT INTO admin_reports (description, response, auth_id) VALUES ($1,$2,$3);`;
    let value = [report, null, user.id];
    await client.query(SQL, value);
  }

  async reports(user) {
    let SQL = `SELECT * FROM admin_reports WHERE auth_id=$1;`;
    let value = [user.id];
    const data = await client.query(SQL, value);
    return data.rows;
  }

  pdfScanner(file) {}

  // get all jobs from database
  async jobsApi() {
    let SQL = 'SELECT title,location,type,description FROM jobs;';
    let data = await client.query(SQL);
    const count = data.rows.length;
    return { count, data: data.rows };
  }

  // get all companies from database
  async companiesApi() {
    let SQL = 'SELECT company_name,phone,company_url,logo,country FROM company;';
    let data = await client.query(SQL);
    const count = data.rows.length;
    return { count, data: data.rows };
  }

  // get all users from database
  async usersApi() {
    let SQL = 'SELECT first_name,last_name,phone,job_title,country,age,avatar,experince,cv FROM person;';
    let data = await client.query(SQL);
    const count = data.rows.length;
    return { count, data: data.rows };
  }

  async generateJobs(num) {
    const arr = [];
    for (let i = 0; i < num; i++) {
      const obj = { title: faker.name.jobTitle(), location: faker.address.country(), type: 'Full Time', description: `contact ${faker.internet.email()}`, company_id: 1 };
      arr.push(obj);
    }
    return arr;
  }

  async seedDB(arr) {
    arr.forEach(async (job) => {
      const { title, location, type, description, company_id } = job;
      const SQL = 'INSERT INTO jobs (title,location,type,description,company_id) VALUES ($1,$2,$3,$4,$5)';
      const values = [title, location, type, description, company_id];
      await client.query(SQL, values);
    });
  }
}

module.exports = new Helper();
