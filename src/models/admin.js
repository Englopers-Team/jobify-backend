'use strict';

const client = require('../models/database');

class Admin {
  constructor() {}
  async dashboard() {
    let SQL;
    let data;

    // SQL =`SELECT COUNT(*) as number_of_reports FROM admin_reports;`;
    // data = await client.query(SQL);
    // const numOfReports = data.rows[0].number_of_reports;

    SQL = `SELECT COUNT(*) AS number_of_reports,account_type FROM admin_reports JOIN auth ON admin_reports.auth_id=auth.id GROUP BY auth.account_type;`;
    data = await client.query(SQL);
    const numOfReportsEach = data.rows;
    let numOfReports = 0;
    numOfReportsEach.forEach((item) => {
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
    numOfJobsEach.forEach((item) => {
      numOfJobs += Number(item.number_of_each_jobstitle);
    });

    SQL = `SELECT COUNT(*) AS number_of_offers,status FROM job_offers GROUP BY status;`;
    data = await client.query(SQL);
    let offersStatus = data.rows;
    let numOfOffers = 0;
    offersStatus.forEach((item) => {
      numOfOffers += Number(item.number_of_offers);
    });

    SQL = `SELECT COUNT(*) AS number_of_each_offerTitle,title FROM job_offers GROUP BY title ORDER BY number_of_each_offerTitle DESC;`;
    data = await client.query(SQL);
    let numOfOfferEach = data.rows;

    SQL = `SELECT COUNT(*) AS number_of_each_app,title FROM applications JOIN jobs ON applications.job_id=jobs.id GROUP BY jobs.title ORDER BY number_of_each_app DESC;`;
    data = await client.query(SQL);
    const numOfAppEach = data.rows;
    let numOfApp = 0;
    numOfAppEach.forEach((item) => {
      numOfApp += Number(item.number_of_each_app);
    });

    SQL = `SELECT COUNT(*) AS number_of_each_companyApp,company_name FROM applications JOIN company ON applications.company_id=company.id GROUP BY company.company_name ORDER BY number_of_each_companyApp DESC;`;
    data = await client.query(SQL);
    const numOfCompanyAppEach = data.rows;

    SQL = `SELECT COUNT(*) AS number_of_each_companyOffers,company_name FROM job_offers JOIN company ON job_offers.company_id=company.id GROUP BY company.company_name ORDER BY number_of_each_companyOffers DESC;`;
    data = await client.query(SQL);
    const numOfCompanyOffersEach = data.rows;

    return { avgAge, numOfReports, numOfReportsEach, numOfReportsOpen, numOfReportsCloesd, numOfJobs, numOfJobsEach, numOfOffers, offersStatus, numOfOfferEach, numOfApp, numOfAppEach, numOfCompanyAppEach, numOfCompanyOffersEach };
  }

  block() {}
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
