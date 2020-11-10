'use strict';

const supergoose = require('@code-fellows/supergoose');
const app = require('../src/server');
const mockRequest = supergoose(app.server);
const pg = require('../src/models/database');

// testAuthorize

xdescribe('Authorization', () => {
  beforeAll(async () => {
    await pg.connect();
  });
  afterAll(async () => {
    await pg.end();
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