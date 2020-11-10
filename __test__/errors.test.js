'use strict';

const supergoose = require('@code-fellows/supergoose');
const app = require('../src/server');
const mockRequest = supergoose(app.server);
const pg = require('../src/models/database');



xdescribe('Error Handling middlewares',()=>{
  beforeAll(async () => {
    await pg.connect();
  });
  afterAll(async () => {
    await pg.end();
  });
  it('404 error handler', () => {
    return mockRequest.get('/test404',(result)=>{
      expect(result.status).toBe(404);
    });
  });
  it('500 error handler', () => {
    return mockRequest.get('/test500',(result)=>{
      expect(result.status).toBe(500);
    });
  });
});