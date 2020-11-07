'use strict';

const client = require('../models/database');

class Admin {
  constructor() {}
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
}

module.exports = new Admin();
