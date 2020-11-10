'use strict';

const client = require('../models/database');
const io = require('socket.io-client');

class Notificaion {
  constructor() {

  }

  async getNotificaions(id) {
    const SQL = 'SELECT * FROM notifications WHERE auth_id=$1;';
    const value = [id];
    const result = await client.query(SQL, value);
    return result.rows;
  }

  async addNotification(payload) {
    const { title, description, id } = payload;
    const SQL = 'INSERT INTO notifications (title,description,seen,auth_id) VALUES ($1,$2,$3,$4);';
    const values = [title, description, 'false', id];
    await client.query(SQL, values);
    // console.log('wow');
    const notifi = io.connect('http://localhost:3000/notification');
    notifi.emit('notification', { id });
  }
}

module.exports = new Notificaion();