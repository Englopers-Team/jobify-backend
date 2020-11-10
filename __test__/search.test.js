'use struct';
const supertest = require('supertest');
const app = require('../src/server');
const mockRequest = supertest(app.server);
const pg = require('../src/models/database');

let token;

describe('API', () => {
  beforeAll(async () => {
    pg.connect();
  });
  afterAll(async () => {
    pg.end();
  });

  it('Any one can for a job and get results', () => {
    return mockRequest.get('/search/job').then((result) => {
      expect(result.status).toBe(200);
    });
  });
  it('Any one can search for companies and get results', () => {
    return mockRequest.get('/search/company').then((result) => {
      expect(result.status).toBe(200);
    });
  });

  it('Only registered companies can search roe employees', async () => {
    await mockRequest
      .post('/signin')
      .send({ email: 'democ@gmail.com', password: '123456' })
      .then((result) => {
        token = result.body.token;
      });
    return mockRequest
      .get('/search/employee')
      .set('Cookie', [`token=${token}`])
      .then((result) => {
        expect(result.status).toBe(200);
      });
  });
  it('Normal users cannot search for employees', async () => {
    await mockRequest
      .post('/signin')
      .send({ email: 'demop@gmail.com', password: '123456' })
      .then((result) => {
        token = result.body.token;
      });
    return mockRequest.get('/search/employee').then((result) => {
      expect(result.status).toBe(500);
      expect(result.text).toBe('{"error":"Access denied"}');
    });
  });

  it('Unregistered users cannot search for employees', async () => {
    return mockRequest.get('/search/employee').then((result) => {
      expect(result.status).toBe(500);
      expect(result.text).toBe('{"error":"Access denied"}');
    });
  });
});
