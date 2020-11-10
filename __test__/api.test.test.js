'use struct';
const supertest = require('supertest');
const app = require('../src/server');
const mockRequest = supertest(app.server);
const pg = require('../src/models/database');

describe('API', () => {
  beforeAll(async () => {
    pg.connect();
  });
  afterAll(async () => {
    pg.end();
  });

  it('Any one can hit the jobs API and get results', () => {
    return mockRequest.get('/api/v1/jobs').then((result) => {
      expect(result.status).toBe(200);
    });
  });
  it('Any one can hit the companies API and get results', () => {
    return mockRequest.get('/api/v1/companies').then((result) => {
      expect(result.status).toBe(200);
    });
  });
  it('Any one can hit the users API and get results', () => {
    return mockRequest.get('/api/v1/employees').then((result) => {
      expect(result.status).toBe(200);
    });
  });
  it('Can get results from 3rd party APIs', () => {
    return mockRequest.get('/api/v1/jobs').then((result) => {
      expect(result.status).toBe(200);
    });
  });
});
