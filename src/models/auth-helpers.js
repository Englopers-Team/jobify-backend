'use strict';
const client = require('../models/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || 'z1337z';

class AuthHelper {
  constructor() {

  }

  async signup(payload) {
    const SQL = `SELECT * FROM auth WHERE email=$1`;
    const value = [payload.email];
    const check = await client.query(SQL, value);
    if (check.rows.length > 0) {
      return Promise.reject('Email already registered');
    } else {
      let { email, password, account_type, first_name, last_name, phone, job_title, country, company_name, logo, company_url } = payload;
      if ((email) && (password) && (account_type)) {
        password = await bcrypt.hash(password, 5);
        const SQL2 = `INSERT INTO auth (email,password,account_type) VALUES ($1,$2,$3);`;
        const values = [email, password, account_type];
        await client.query(SQL2, values);
        const SQL3 = `SELECT * FROM auth WHERE email=$1`;
        const value2 = [email];
        const getID = await client.query(SQL3, value2);
        const id = getID.rows[0].id;
        if ((account_type == 'p') && ((first_name) && (last_name) && (phone) && (job_title) && (country))) {
          const SQL3 = `INSERT INTO person (first_name,last_name,phone,job_title,country,auth_id) VALUES ($1,$2,$3,$4,$5,$6);`;
          const values2 = [first_name, last_name, phone, job_title, country, id];
          await client.query(SQL3, values2);
          return Promise.resolve({ id, account_type });
        } else if ((account_type == 'c') && ((company_name) && (logo) && (company_url) && (phone) && (country))) {
          const SQL3 = `INSERT INTO company (company_name,phone,logo,country,company_url,auth_id) VALUES ($1,$2,$3,$4,$5,$6);`;
          const values2 = [company_name, phone, logo, country, company_url, id];
          await client.query(SQL3, values2);
          return Promise.resolve({ id, account_type });
        }
        // console.log('Missing data from payload');
        return Promise.reject('Fill all required data');
      } else {
        console.log('Wrong key from payload');
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

  generateToken(user) {
    let token = jwt.sign({ userID: user.id, account_type: user.account_type }, SECRET, {
      expiresIn: `60min`,
    });
    return token;
  }

  async authenticateToken(token) {
    try {
      const tokenObject = jwt.verify(token, SECRET);
      const SQL = `SELECT * FROM auth WHERE id=$1`;
      const value = [tokenObject.userID];
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
    if(result.rows.length>0) return true;
    else return false;
  }
}

module.exports = new AuthHelper();