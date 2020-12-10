'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//---------------------------------// Import Resources \\-------------------------------\\
const client = require('../models/database');
const helper = require('./helper');

//--------------------------------// Esoteric Resources \\-------------------------------\\
const SECRET = process.env.SECRET || 'z1337z';

//---------------------------------// AuthHelper Module \\-------------------------------\\
class AuthHelper {
  constructor() {}

  async signup(payload) {
    const check = await this.checkEmail(payload.email);
    if (check) {
      return Promise.reject('Email already registered');
    } else {
      let { email, password, account_type, first_name, last_name, phone, job_title, country, company_name, logo, company_url } = payload;
      if (email && password && account_type) {
        password = await bcrypt.hash(password, 5);
        const SQL2 = `INSERT INTO auth (email,password,account_type) VALUES ($1,$2,$3);`;
        const values = [email, password, account_type];
        await client.query(SQL2, values);
        const SQL3 = `SELECT * FROM auth WHERE email=$1`;
        const value2 = [email];
        const getID = await client.query(SQL3, value2);
        // const account_status = getID.rows[0].account_status;
        const id = getID.rows[0].id;
        if (account_type == 'p' && first_name && last_name && phone && job_title && country) {
          const SQL3 = `INSERT INTO person (first_name,last_name,phone,job_title,country,auth_id) VALUES ($1,$2,$3,$4,$5,$6);`;
          const values2 = [first_name, last_name, phone, job_title, country, id];
          await client.query(SQL3, values2);
          await helper.sendVerifyEmail(payload);
          return Promise.resolve({ id, account_type });
        } else if (account_type == 'c' && company_name && logo && company_url && phone && country) {
          const SQL3 = `INSERT INTO company (company_name,phone,logo,country,company_url,auth_id) VALUES ($1,$2,$3,$4,$5,$6);`;
          const values2 = [company_name, phone, logo, country, company_url, id];
          await client.query(SQL3, values2);
          await helper.sendVerifyEmail(payload);
          return Promise.resolve({ id, account_type });
        } else if (account_type == 'admin' || account_type == 'editor') {
          return Promise.resolve({ id, account_type });
        } else {
          let SQL4 = 'DELETE FROM auth WHERE id=$1;';
          let values3 = [id];
          await client.query(SQL4, values3);
          return Promise.reject('Fill all required data');
        }
      } else {
        return Promise.reject('Wrong key');
      }
    }
  }

  async authenticateBasic(email, password) {
    const SQL = `SELECT * FROM auth WHERE email=$1`;
    const value = [email];
    const check = await client.query(SQL, value);
    if (check.rows.length > 0) {
      const valid = await bcrypt.compare(password, check.rows[0].password);
      if (valid) return check.rows[0];
    }
    throw new Error('Invalid Login');
  }

  async generateToken(user) {
    let table;
    let profile = {};
    if (user.account_type == 'p') {
      table = 'person';
      const SQL = `SELECT * FROM ${table} WHERE auth_id=$1;`;
      const value = [user.id];
      let results = await client.query(SQL, value);
      profile = { id: results.rows[0].id, first: results.rows[0].first_name, last: results.rows[0].last_name, avatar: results.rows[0].avatar, country: results.rows[0].country };
    } else if (user.account_type == 'c') {
      table = 'company';
      const SQL = `SELECT * FROM ${table} WHERE auth_id=$1;`;
      const value = [user.id];
      let results = await client.query(SQL, value);
      profile = { id: results.rows[0].id, name: results.rows[0].company_name, logo: results.rows[0].logo, country: results.rows[0].country };
    }
    let token = jwt.sign({ id: user.id, account_type: user.account_type, profile }, SECRET, {
      expiresIn: `6000000000min`,
    });
    return token;
  }

  async authenticateToken(token) {
    try {
      const tokenObject = jwt.verify(token, SECRET);
      const SQL = `SELECT * FROM auth WHERE id=$1`;
      const value = [tokenObject.id];
      const check = await client.query(SQL, value);

      if (check.rows[0].account_type == tokenObject.account_type) {
        return Promise.resolve(tokenObject);
      } else {
        throw new Error('Invalid token');
      }
    } catch (e) {
      throw new Error('Invalid token');
    }
  }

  async checkEmail(email) {
    const SQL = `SELECT * FROM auth WHERE email=$1`;
    const value = [email];
    const result = await client.query(SQL, value);
    if (result.rows.length > 0) return true;
    else return false;
  }

  async verify(user, payload) {
    let SQL = 'SELECT verify_token FROM auth where id=$1;';
    let value = [user.id];
    let data = await client.query(SQL, value);
    let verify_token = data.rows[0].verify_token;
    if (payload == verify_token) {
      let SQL = 'UPDATE auth SET account_status=$1 where id=$2;';
      let value = ['active', user.id];
      await client.query(SQL, value);
      return true;
    } else {
      throw new Error('Please Check the sent code');
    }
  }
}

//-----------------------------------// Export The Module \\-----------------------------------\\
module.exports = new AuthHelper();

//-----------------------------------------------------------------------------------------\\
