'use strict';

//---------------------------------// Import Resources \\-------------------------------\\
const client = require('../models/database');
const helper = require('./helper');

//-----------------------------------// Admin Module \\---------------------------------\\
class Admin {
  constructor() { }

  async dashboard() {
    let SQL;
    let data;

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

    SQL = `SELECT COUNT(*) AS number_of_accepted_apps,status FROM applications GROUP BY status;`;
    data = await client.query(SQL);
    let statusApps = data.rows;

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

    let totalUser = numCompany + numPerson;

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
    let numOfDbApp = 0;
    numOfAppEach.forEach((item) => {
      numOfDbApp += Number(item.number_of_each_app);
    });

    SQL = ` SELECT COUNT(*) As num_of_api_app FROM applications_api;`;
    data = await client.query(SQL);
    const numOfApiApp = data.rows[0].num_of_api_app;

    SQL = `SELECT COUNT(*) AS number_of_each_companyApp,company_name FROM applications JOIN company ON applications.company_id=company.id GROUP BY company.company_name ORDER BY number_of_each_companyApp DESC;`;
    data = await client.query(SQL);
    const numOfCompanyAppEach = data.rows;

    SQL = `SELECT COUNT(*) AS number_of_each_companyOffers,company_name FROM job_offers JOIN company ON job_offers.company_id=company.id GROUP BY company.company_name ORDER BY number_of_each_companyOffers DESC;`;
    data = await client.query(SQL);
    const numOfCompanyOffersEach = data.rows;

    return {
      totalUser,
      numCompany,
      numPerson,
      avgAge,
      numOfReports,
      numOfReportsEach,
      numOfReportsOpen,
      numOfReportsCloesd,
      numOfJobs,
      numOfJobsEach,
      statusApps,
      numOfOffers,
      offersStatus,
      numOfOfferEach,
      numOfTotalApp: Number(numOfApiApp) + Number(numOfDbApp),
      numOfDbApp,
      numOfAppEach,
      numOfApiApp,
      numOfCompanyAppEach,
      numOfCompanyOffersEach,
      numberPersonEachJobTitle,
      numberPersonEachCountry,
      numberCompanyEachCountry,
    };
  }

  async block(id) {
    let user = await helper.getProfile(id, 'auth');
    if (user.account_type !== 'admin') {
      let SQL = `UPDATE auth SET account_status=$1 WHERE id=$2;`;
      let values = ['blocked', id];
      await client.query(SQL, values);
    } else throw new Error(`Cannot block admins`);
  }

  async removeBlock(id) {
    let SQL = `UPDATE auth SET account_status=$1 WHERE id=$2;`;
    let values = ['active', id];
    await client.query(SQL, values);
  }

  async reports() {
    let SQL = `SELECT * FROM admin_reports;`;
    const data = await client.query(SQL);
    return data.rows;
  }

  async report(payload) {
    let SQL = `SELECT * FROM admin_reports JOIN auth ON admin_reports.auth_id=auth.id WHERE admin_reports.id=$1;`;
    let value = [payload];
    const data = await client.query(SQL, value);
    let SQL2, value2;
    if (data.rows[0].account_type === 'c') {
      let id = await helper.getID(data.rows[0].auth_id, 'company');
      SQL2 = `SELECT * FROM company WHERE id=$1;`;
      value2 = [id];
    } else if (data.rows[0].account_type === 'p') {
      let id = await helper.getID(data.rows[0].auth_id, 'person');
      SQL2 = `SELECT * FROM person WHERE id=$1;`;
      value2 = [id];
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

  async getAllUser() {
    let SQL1 = 'SELECT * FROM person';
    let SQL2 = 'SELECT * FROM company';
    let dataPerson = await client.query(SQL1);
    let dataCompany = await client.query(SQL2);
    return { dataPerson, dataCompany };
  }
}

//-----------------------------------// Export Module \\-----------------------------------\\
module.exports = new Admin();

//-----------------------------------------------------------------------------------------\\
