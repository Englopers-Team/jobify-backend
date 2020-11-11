'use struct';

const supergoose = require('@code-fellows/supergoose');
const app = require('../src/server');
const mockRequest = supergoose(app.server);
const pg = require('../src/models/database');

describe('API', () => {
  beforeAll(async () => {
    await pg.connect();
  });
  afterAll(async () => {
    await pg.end();
  });

  it('Get results from jobs API successfully', () => {
    return mockRequest.get('/api/v1/jobs').then((result) => {
      expect(result.status).toBe(200);
    });
  });
  it('Get results from companies API successfully', () => {
    return mockRequest.get('/api/v1/companies').then((result) => {
      expect(result.status).toBe(200);
    });
  });
  it('Get results from employees API successfully', () => {
    return mockRequest.get('/api/v1/employees').then((result) => {
      expect(result.status).toBe(200);
    });
  });
  it('Get results from 3rd party API successfully', () => {
    return mockRequest.get('/api/v1/mockApi').then((result) => {
      expect(result.status).toBe(200);
    });
  });
});
