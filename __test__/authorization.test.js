'use strict';

const supertest = require('supertest');
const app = require('../src/server');
const mockRequest = supertest(app.server);
const pg = require('../src/models/database');

// testAuthorize

describe('Authorization', () => {
  beforeAll(async () => {
    pg.connect();
  });
  afterAll(async () => {
    pg.end();
  });
  it('Authorize middlewares with allowed authorize', () => {
    return mockRequest.post('/signin').send({ email: 'demop@gmail.com', password: '123456' }).then((data) => {
      return mockRequest.get('/testAuthorize').set('Cookie', [`token=${data.body.token}`]).then((result) => {
        expect(result.status).toBe(200);
      });
    });
  });

  it('Authorize middlewares with no authorize', () => {
    return mockRequest.post('/signin').send({ email: 'democ@gmail.com', password: '123456' }).then((data) => {
      return mockRequest.get('/testAuthorize').set('Cookie', [`token=${data.body.token}`]).then((result) => {
        expect(result.status).toBe(500);
      });
    });
  });

  it('Authorize middlewares without signin', () => {
    return mockRequest.get('/testAuthorize').then((result) => {
      expect(result.status).toBe(500);
    });
  });
});