'use strict';

const client = require('../models/database');

class Admin {
  constructor() { }
  async dashboard() {

    // const SQL =`SELECT COUNT(*) as number_of_reportS FROM admin_reports;`;
    // const SQL =`SELECT COUNT(*) as number_of_jobs FROM jobs;`;
    // const SQL =`SELECT COUNT(*) as number_of_offers FROM job_offers;`;
    // const SQL =`SELECT COUNT(*) as number_of_apps FROM applications;`;
    // const SQL =`SELECT COUNT(*) as number_of_person FROM person;`;
    // const SQL =`SELECT COUNT(*) as number_of_company FROM company;`;

    // const SQL2 = `SELECT title, COUNT(id) as num_each_jobs
    // FROM jobs
    // GROUP BY title;`;
    // const data2 = await client.query(SQL);
    // const numJobByTitle = data2.rows;

    // const SQL3 = `SELECT job_title, COUNT(id) as num_person_jobs_title
    // FROM person
    // GROUP BY job_title;`;
    // const data3 = await client.query(SQL3);
    // const numPersonByJob = data3.rows;

    // const SQL4 = `SELECT AVG(age) as average_age FROM person`;
    // const data4 = await client.query(SQL4);
    // const avgPersonAge = data4.rows[0].average_age;

  
    // return { reportsNum, numJobByTitle, numPersonByJob, avgPersonAge };
  }
  block() {

  }
  async reports() {
    let SQL = `SELECT * FROM admin_reports;`;
    const data = await client.query(SQL);
    return data.rows;
  }
  async report(payload) {
    let SQL = `SELECT * FROM admin_reports WHERE id=$1;`;
    let value = [payload];
    const data = await client.query(SQL, value);
    let SQL2, value2;

    if (data.rows[0].account_type === 'c') {
      SQL2 = `SELECT * FROM company WHERE id=$1;`;
      value2 = [data.rows[0].company_id];
    } else if (data.rows[0].account_type === 'p') {
      SQL2 = `SELECT * FROM person WHERE id=$1;`;
      value2 = [data.rows[0].person_id];
    }
    const data2 = await client.query(SQL2, value2);
    return { report: data.rows[0], sender: data2.rows[0] };
  }
  async answerReport(id, payload) {
    let SQL = `UPDATE admin_reports SET response=$1 WHERE id=$2;`;
    let value = [payload, id];
    await client.query(SQL, value);
  }
  async deleteReport(id) {
    let SQL = `DELETE FROM admin_reports WHERE id=$1;`;
    let value = [id];
    await client.query(SQL, value);
  }
}

module.exports = new Admin();
