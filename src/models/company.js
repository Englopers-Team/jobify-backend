'use strict';

const client = require('../models/database');


const notifi = require('../models/notifications');
const helpers  = require('./helper');

class Company {
  constructor() {}

  async dashboard(company) {
    const offers = await this.companyOffers(company);
    const apps = await this.companyApps(company);
    return { offers, apps };
  }

  async jobs(company) {
    const id = helper.getID(company.id, 'company');
    let SQL = `SELECT * FROM jobs WHERE company_id=$1;`;
    let value = [id];
    const data = await client.query(SQL, value);
    return data.rows;
  }

  async submitJob(company, payload) {
    const id = helper.getID(company.id, 'company');
    let { title, location, type, description } = payload;
    let SQL = `INSERT INTO jobs (company_id,title,location,type,description) VALUES ($1,$2,$3,$4,$5);`;
    let value = [id, title, location, type, description];
    await client.query(SQL, value);
  }

  async editJob(jobID, payload) {
    let { title, location, type, description } = payload;
    let SQL = `UPDATE jobs SET title=$1,location=$2,type=$3,description=$4 WHERE id=$5;`;
    let value = [title, location, type, description, jobID];
    await client.query(SQL, value);
  }

  async deleteJob(jobID) {
    let SQL1 = `DELETE FROM applications WHERE job_id=$1;`;
    let SQL2 = `DELETE FROM jobs WHERE id=$1;`;
    let value = [jobID];
    await client.query(SQL1, value);
    await client.query(SQL2, value);
  }

  async companyApps(company) {
    const id = helper.getID(company.id, 'company');
    let SQL = `SELECT * FROM applications WHERE company_id=$1`;
    let value = [id];
    const data = await client.query(SQL, value);
    return data.rows;
  }

  async answerApp(appID, payload) {
    let SQL = `UPDATE applications SET status=$1 WHERE id=$2`;
    let value = [payload, appID];
    await client.query(SQL, value);
  }

  async companyOffers(company) {
    const id = helper.getID(company.id, 'company');
    let SQL = `SELECT * FROM job_offers WHERE company_id=$1`;
    let value = [id];
    const data = await client.query(SQL, value);
    return data.rows;
  }


  async sendOffer(company, user, payload) {
    const id = helper.getID(company.id, 'company');
    let person_id = user;
    let company_id = id;
    let { title, location, type, description } = payload;
    let SQL = `INSERT INTO job_offers (person_id,company_id,title,location,type,description) VALUES ($1,$2,$3,$4,$5,$6);`;
    let value = [person_id, company_id, title, location, type, description];
    await client.query(SQL, value);
    const data = {id:person_auth_id,title:'offer',description:`${title} from company number ${company_id}`};
    await notifi.addNotification(data);
  }

  async deleteOffer(offerID) {
    let SQL = `DELETE FROM job_offers WHERE id=$1`;
    let value = [offerID];
    await client.query(SQL, value);
  }

  async editProfile(company, payload) {
    const id = helper.getID(company.id, 'company');
    let { company_name, phone, logo, country, company_url } = payload;
    let SQL = `UPDATE company SET company_name=$1,phone=$2,logo=$3,country=$4,company_url=$5 WHERE id=$6;`;
    let value = [company_name, phone, logo, country, company_url, id];
    await client.query(SQL, value);
  }

  async searchEmployee(payload) {
    let { job_title, country } = payload;
    let SQL = `SELECT * FROM person WHERE job_title=$1 AND country=$2;`;
    let value = [job_title, country];
    const result = await client.query(SQL, value);
    return result.rows[0];
  }
}

module.exports = new Company();
