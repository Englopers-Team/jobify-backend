'use strict';

//---------------------------------// Import Resources \\-------------------------------\\
const client = require('../models/database');
const app = require('../server');
const messages = app.messages;
const authHelpers = require('../models/auth-helpers');
const helper = require('../models/helper');

//--------------------------------// Messages Namespace \\--------------------------------\\
messages.on('connection', (socket) => {
  console.log('connected to messages namespace', socket.id);

  socket.on('join', async (room) => {
    try {
      if (room.length == 0) {
        return;
      }
      const tokenObject = await authHelpers.authenticateToken(room);
      console.log('joined', tokenObject.id);
      socket.join(tokenObject.id);
    } catch (err) {
      throw new Error('Invalid token to check messages');
    }
  });

  socket.on('message', async (payload) => {
    const tokenObject = await authHelpers.authenticateToken(payload.token);
    if (tokenObject.account_type === payload.type) {
      throw new Error(`Can't send message for this user`);
    }
    let table;
    let companyID;
    let personID;
    if (payload.type == 'c') {
      table = 'company';
      companyID = Number(payload.receiver);
      personID = await helper.getID(tokenObject.id, 'person');
    } else if (payload.type == 'p') {
      table = 'person';
      companyID = await helper.getID(tokenObject.id, 'company');
      personID = Number(payload.receiver);
    }
    let id;
    try {
      id = await helper.getAuthID(Number(payload.receiver), table);
    } catch (err) {
      throw new Error(`This id doesn't existing`);
    }
    if (tokenObject.account_type == 'p' && payload.type == 'c') {
      let SQL = `SELECT * FROM messages WHERE person_id=$1 AND company_id=$2;`;
      let value = [personID, companyID];
      const data = await client.query(SQL, value);
      if (data.rows.length == 0) {
        throw new Error(`There is no connection between ${payload.receiver} id company`);
      }
    }
    if (messages.adapter.rooms[id]) {
      messages.to(id).emit('message', payload.body);
    }
    let SQL = `INSERT INTO messages (body,person_id,company_id) VALUES ($1,$2,$3);`;
    let value = [payload.body, personID, companyID];
    await client.query(SQL, value);
  });

  socket.on('checkMsg', async (payload) => {
    try {
      if (payload.token.length == 0) {
        return;
      }
      const tokenObject = await authHelpers.authenticateToken(payload.token);
      let user;
      let targeted;
      if (tokenObject.account_type == 'p') {
        user = 'person';
        targeted = 'company';
      } else if (tokenObject.account_type == 'c') {
        user = 'company';
        targeted = 'person';
      }
      const userID = await helper.getID(tokenObject.id, user);
      let SQL = `SELECT DISTINCT ${targeted}_id FROM messages WHERE ${user}_id=$1;`;
      let value = [userID];
      let result = await client.query(SQL, value);
      const msgfrom = result.rows;
      const arr = await Promise.all(
        msgfrom.map(async (id) => {
          let SQL1 = `SELECT * FROM messages WHERE ${targeted}_id=$1 AND ${user}_id=$2;`;
          let value1 = [id[Object.keys(msgfrom[0])[0]], userID];
          let result1 = await client.query(SQL1, value1);
          let searchFor = '';
          if (targeted === 'person') {
            searchFor = 'first_name';
          } else {
            searchFor = 'company_name';
          }
          let SQL2 = `SELECT ${searchFor} FROM ${targeted} WHERE id=$1;`;
          let value2 = [id[Object.keys(msgfrom[0])[0]]];
          let result2 = await client.query(SQL2, value2);
          return { [result2.rows[0][searchFor]]: result1.rows };
        }),
      );
      messages.to(tokenObject.id).emit('message', arr);

    } catch (err) {
      throw new Error('Invalid token to check messages');
    }
  });
});

//-----------------------------------------------------------------------------------------\\
