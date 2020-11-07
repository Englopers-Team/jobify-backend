'use strict';

const client = require('../models/database');

class Admin {
  constructor() { }
  async dashboard() {
    let SQL;
    let data;

    SQL = `SELECT COUNT(*) AS number_of_reports,account_type FROM admin_reports JOIN auth ON admin_reports.auth_id=auth.id GROUP BY auth.account_type;`;
    data = await client.query(SQL);
    const numOfReportsEach = data.rows;
    let numOfReports = 0;
    numOfReportsEach.forEach(item => {
      numOfReports += Number(item.number_of_reports);
    });

    SQL = `SELECT COUNT(*) AS number_of_open_reports FROM admin_reports WHERE response IS NULL;`;
    data = await client.query(SQL);
    let numOfReportsOpen = data.rows[0].number_of_open_reports;
    let numOfReportsCloesd = numOfReports - Number(numOfReportsOpen);

    SQL = `SELECT AVG(age) AS average_age FROM person;`;
    data = await client.query(SQL);
    let avgAge = Math.floor(data.rows[0].average_age);

    SQL = `SELECT COUNT(*) AS number_of_each_jobstitle,title FROM jobs GROUP BY title ORDER BY number_of_each_jobstitle DESC;`;
    data = await client.query(SQL);
    let numOfJobsEach = data.rows;
    let numOfJobs = 0;
    numOfJobsEach.forEach(item => {
      numOfJobs += Number(item.number_of_each_jobstitle);
    });

    SQL = `SELECT COUNT(*) AS number_of_accepted_apps,status FROM applications GROUP BY status;`;
    data = await client.query(SQL);
    let statusApps = data.rows;
    let numOfApps = 0;
    statusApps.forEach((item) => {
      numOfApps += Number(item.number_of_accepted_apps);
    });

    SQL = `SELECT COUNT(*) AS number_person_ofeach_jobtilte,job_title FROM person GROUP BY job_title ORDER BY number_person_ofeach_jobtilte DESC;`;
    data = await client.query(SQL);
    let numberPersonEachJobTitle = data.rows;

    SQL = `SELECT COUNT(*) AS number_person_ofeach_country,country FROM person GROUP BY country ORDER BY number_person_ofeach_country DESC;`;
    data = await client.query(SQL);
    let numberPersonEachCountry = data.rows;

    SQL = `SELECT COUNT(*) AS number_company_ofeach_country,country FROM company GROUP BY country ORDER BY number_company_ofeach_country DESC;`;
    data = await client.query(SQL);
    let numberCompanyEachCountry = data.rows;

    let numPerson = 0;
    numberPersonEachCountry.forEach((item) => {
      numPerson += Number(item.number_person_ofeach_country);
    });

    let numCompany = 0;
    numberCompanyEachCountry.forEach((item) => {
      numCompany += Number(item.number_company_ofeach_country);
    });
    
    let totalUser = numCompany+numPerson;

    return { totalUser, numCompany , numPerson ,avgAge, numOfReports, numOfReportsEach, numOfReportsOpen, numOfReportsCloesd, numOfJobs, numOfJobsEach, numOfApps, statusApps, numberPersonEachJobTitle, numberPersonEachCountry, numberCompanyEachCountry };
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
