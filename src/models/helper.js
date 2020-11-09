'use strict';
const superagent = require('superagent');
const client = require('../models/database');
const faker = require('faker');
const nodemailer = require('nodemailer');

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
      const obj = {
        title: faker.name.jobTitle(),
        location: faker.address.country(),
        type: 'Full Time',
        email: faker.internet.email(),
        description: `contact ${faker.name.jobTitle()} ${faker.internet.email()} ${faker.address.country()}`,
        company_id: 1,
      };
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

  sendEmail(email, payload) {
    console.log('Email sent successfully');
    console.log(email, payload);
    const transporter = nodemailer.createTransport({
      service: 'zoho',
      auth: {
        user: 'electrical@perfectsolutionco.com',
        pass: 'Perfect.Sol.777!',
      },
    });

    const mailOptions = {
      from: 'electrical@perfectsolutionco.com',
      to: email,
      subject: `${payload.person.first_name} ${payload.person.last_name} ${payload.company.title} Job Application`,
      text: `Dear Sir,
      I’m writing in response to your recently advertised position as an ${payload.company.title} I am very interested in this opportunity with you, and i believe that my qualifications, education, and professional experience would make me a strong candidate for the position.
      Enclosed is my resume that more fully details my background and work experience, and how they relate to your position.
      Thank you in advance for your consideration.
      Best regards.`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  async sendVerifyEmail(payload) {
    let random = faker.random.number();
    let SQL = 'UPDATE auth SET verify_token=$1 WHERE email=$2;';
    let values = [random, payload.email];
    await client.query(SQL, values);
    console.log('verify', payload);
    const transporter = nodemailer.createTransport({
      service: 'zoho',
      auth: {
        user: 'electrical@perfectsolutionco.com',
        pass: 'Perfect.Sol.777!',
      },
    });
    let name;
    if (payload.account_type == 'p') {
      name = `${payload.first_name} ${payload.last_name}`;
    } else {
      name = payload.company_name;
    }

    const mailOptions = {
      from: 'electrical@perfectsolutionco.com',
      to: payload.email,
      cc: 'mohammad.esseili@gmail.com',
      subject: `VERIFICATION EMAIL for ${name}`,
      text: `VERIFICATION Link : http://localhost:3000/verify/${random}`,
    };

    transporter.sendMail(mailOptions);
    return random;
  }

  async getProfile(id, table) {
    const SQL = `SELECT * FROM ${table} WHERE id=$1;`;
    const value = [id];
    const result = await client.query(SQL, value);
    return result.rows[0];
  }
}

module.exports = new Helper();
