'use strict';

const supergoose = require('@code-fellows/supergoose');
const app = require('../src/server');
const mockRequest = supergoose(app.server);
const pg = require('../src/models/database');



describe('Error Handling middlewares',()=>{
  afterAll(async () => {
    pg.end();
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