'use strict';

//------------------------------// Third Party Resources \\----------------------------\\
require('dotenv').config();
const superagent = require('superagent');

//---------------------------------// Import Resources \\-------------------------------\\
const client = require('../models/database');
const notifi = require('../models/notifications');
const helper = require('./helper');

//--------------------------------// Esoteric Resources \\-------------------------------\\
const test = process.env.TESTS || 'true';

//------------------------------------// User Module \\----------------------------------\\
class User {
  constructor() {}

  async dashboard(user) {
    const id = await helper.getID(user.id, 'person');
    let SQL = `SELECT job_title,country FROM person WHERE id=$1;`;
    let value = [id];
    const data = await client.query(SQL, value);
    const title = data.rows[0].job_title;
    const location = data.rows[0].country;
    const job = await this.searchJob({ title, location });
    const suggJob = { resultDB: job.resultDB.splice(5), resultAPI: job.resultAPI.splice(5) };
    const apps = await this.userApps(user);
    const offer = await this.userOffers(user);
    let notifications;
    if (test == 'false') {
      notifications = await notifi.getNotificaions(user.id);
    }
    return { suggJob, numOfApp: Number(apps.DB.length) + Number(apps.API.length), numOfOffer: offer.length, notifications };
  }

  async applyDB(user, payload) {
    let { jobID, companyID } = payload;
    let personID = await helper.getID(user.id, 'person');
    let compID = await helper.getAuthID(companyID, 'company');
    let SQL = `INSERT INTO applications (person_id,job_id,company_id) VALUES ($1,$2,$3);`;
    let SQL2 = `UPDATE jobs SET applicants_num=applicants_num+1 WHERE id=$1;`;
    let value = [personID, jobID, companyID];
    let value2 = [jobID];
    await client.query(SQL, value);
    await client.query(SQL2, value2);
    let SQL3 = `SELECT * FROM person WHERE id=$1;`;
    let value3 = [personID];
    let results = await client.query(SQL3, value3);
    if (test == 'false') {
      const data = { id: compID, title: 'Application', description: `You have recived application from ${results.rows[0].first_name} ${results.rows[0].last_name}` };
      await notifi.addNotification(data);
    }
  }

  async applyAPI(user, payload) {
    let { title, location, type, company_name, logo, email } = payload;
    let personID = await helper.getID(user.id, 'person');
    let SQL = `INSERT INTO applications_api (title, location, type, company_name, status, logo, person_id) VALUES ($1,$2,$3,$4,$5,$6,$7);`;
    let value = [title, location, type, company_name, 'Submitted', logo, personID];
    await client.query(SQL, value);
    let userData = await helper.getProfile(personID, 'person');
    let authData = await helper.getProfile(userData.auth_id, 'auth');
    const record = { company: payload, person: { ...userData, ...authData } };
    helper.sendEmail(email, record);
  }

  async saveJob(user, payload) {
    const id = await helper.getID(user.id, 'person');
    if (payload.api == undefined) {
      let SQL = `INSERT INTO saved_jobs (job_id,person_id) VALUES ($1,$2);`;
      let Values = [payload.jobID, id];
      await client.query(SQL, Values);
    } else {
      let { title, location, type, description, company_name, phone, company_url, logo, country } = payload;
      let SQL = `INSERT INTO saved_jobs (title, location, type, description, company_name, phone, company_url, logo, country,person_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);`;
      let value = [title, location, type, description, company_name, phone, company_url, logo, country, id];
      await client.query(SQL, value);
    }
  }

  async savedJobs(user) {
    const id = await helper.getID(user.id, 'person');
    let SQL = `SELECT * FROM saved_jobs WHERE person_id=$1 AND job_id IS null;`;
    let SQL2 = `SELECT * FROM saved_jobs JOIN jobs ON saved_jobs.job_id=jobs.id JOIN company ON jobs.company_id=company.id WHERE person_id=$1;`;
    let value = [id];
    let dataApi = await client.query(SQL, value);
    let dataDB = await client.query(SQL2, value);
    return { data_Api: dataApi.rows, data_DB: dataDB.rows };
  }

  async userApps(user) {
    const id = await helper.getID(user.id, 'person');
    let SQL = `SELECT *,applications.id FROM applications JOIN jobs ON applications.job_id=jobs.id JOIN company ON applications.company_id=company.id WHERE person_id= $1 ORDER BY applications.id DESC;`;
    let value = [id];
    let SQL2 = `SELECT * FROM applications_api WHERE person_id= $1 ORDER BY id DESC;`;
    let value2 = [id];
    const dataDB = await client.query(SQL, value);
    const dataApi = await client.query(SQL2, value2);

    return { DB: dataDB.rows, API: dataApi.rows };
  }

  async userApp(user, appID) {
    const id = await helper.getID(user.id, 'person');
    let SQL = `SELECT * FROM applications WHERE id=$1 AND person_id=$2 ORDER BY id DESC;`;
    let value = [appID, id];
    const data = await client.query(SQL, value);
    if (data.rows[0].length) {
      throw new Error();
    }
    return data.rows[0];
  }

  async deleteApp(user, appID) {
    await this.userApp(user, appID);
    let SQL = `SELECT job_id FROM applications WHERE id=$1;`;
    let value = [appID];
    const data = await client.query(SQL, value);
    let jobID = data.rows[0].job_id;
    let SQL2 = `UPDATE jobs SET applicants_num=applicants_num-1 WHERE id=$1;`;
    let value2 = [jobID];
    await client.query(SQL2, value2);
    const id = await helper.getID(user.id, 'person');
    let SQL3 = `DELETE FROM applications WHERE id=$1 AND person_id=$2;`;
    let value3 = [appID, id];
    await client.query(SQL3, value3);
  }

  async deleteAppApi(user, appID) {
    const id = await helper.getID(user.id, 'person');
    let SQL = `DELETE FROM applications_api WHERE id=$1 AND person_id=$2;`;
    let value = [appID, id];
    await client.query(SQL, value);
  }

  async userOffers(user) {
    const id = await helper.getID(user.id, 'person');
    let SQL = `SELECT *,job_offers.id FROM job_offers JOIN company ON job_offers.company_id=company.id WHERE person_id=$1 ORDER BY job_offers.id DESC;`;
    let value = [id];
    const data = await client.query(SQL, value);
    return data.rows;
  }

  async answerOffer(user, offerID, payload) {
    const id = await helper.getID(user.id, 'person');
    const SQL1 = `SELECT person_id FROM job_offers WHERE id=$1`;
    const value1 = [offerID];
    const check = await client.query(SQL1, value1);
    if (check.rows[0].person_id == id) {
      let SQL = `UPDATE job_offers SET status=$1 WHERE id=$2;`;
      let value = [payload, offerID];
      await client.query(SQL, value);
    } else {
      throw new Error(`Can't answer offer`);
    }
  }

  async editProfile(user, payload) {
    const id = await helper.getID(user.id, 'person');
    let { first_name, last_name, phone, job_title, country, age, avatar, experince, cv } = payload;
    let SQL = `UPDATE person SET first_name=$1,last_name=$2,phone=$3,job_title=$4,country=$5,age=$6,avatar=$7,experince=$8,cv=$9 WHERE id=$10;`;
    let value = [first_name, last_name, phone, job_title, country, age, avatar, experince, cv, id];
    await client.query(SQL, value);
  }

  async searchJob(payload) {
    let { title, location } = payload;
    let SQL = `SELECT *,jobs.id FROM jobs JOIN company ON jobs.company_id=company.id WHERE title ~* $1 AND location ~* $2;`;
    let value = [title, location];
    let URL = `https://jobs.github.com/positions.json?description=${title}&location=${location}&?markdown=true`;
    const result1 = await client.query(SQL, value);
    const resultDB = result1.rows;
    const result2 = await superagent.get(URL);
    const resultAPI = result2.body.map((item) => {
      return new JOB(item);
    });
    return { resultDB, resultAPI };
  }

  async searchCompany(payload) {
    let { company_name, country } = payload;
    let SQL = `SELECT * FROM company WHERE company_name ~* $1 AND country ~* $2;`;
    let value = [company_name, country];
    const result = await client.query(SQL, value);
    return result.rows;
  }

  async updateExperience(user, payload) {
    const id = await helper.getID(user.id, 'person');
    let { title, company, field, starting_date, ending_date, present, location, description, logo } = payload;
    let SQL = `UPDATE experience SET title=$1,field=$2,starting_date=$3,ending_date=$4,present=$5,location=$6,description=$7,logo=$8,company=$9 WHERE id=$10;`;
    let value = [title, field, starting_date, ending_date, present, location, description, logo, company, id];
    await client.query(SQL, value);
  }

  async updateEducation(user, payload) {
    const id = await helper.getID(user.id, 'person');
    let { school, degree, field, starting_date, ending_date, present, grade, description, logo } = payload;
    let SQL = `UPDATE education SET school=$1,degree=$2,field=$3,starting_date=$4,ending_date=$5,present=$6,grade=$7,description=$8,logo=$9 WHERE id=$10;`;
    let value = [school, degree, field, starting_date, ending_date, present, grade, description, logo, id];
    await client.query(SQL, value);
  }

  async updateCourses(user, payload) {
    const id = await helper.getID(user.id, 'person');
    let { course_name, field, course_date, org } = payload;
    let SQL = `UPDATE courses SET course_name=$1,field=$2,course_date=$3,org=$4 WHERE id=$5;`;
    let value = [course_name, field, course_date, org, id];
    await client.query(SQL, value);
  }
}

const JOB = function (data) {
  this.title = data.title ? data.title : 'There is no job title';
  this.location = data.location ? data.location : 'Amman';
  this.type = data.type ? data.type : 'Full-time';
  this.company_name = data.company ? data.company : 'Company Name';
  this.logo = data.company_logo || 'https://cdn.icon-icons.com/icons2/1378/PNG/512/avatardefault_92824.png';
  this.company_url = data.company_url;
  this.email = data.email ? data.email : 'mohammad.esseili@gmail.com';
  this.api = true;
};

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = new User();

//-----------------------------------------------------------------------------------------\\
