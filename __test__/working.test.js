'use strict';

const supertest = require('supertest');
const { server } = require('../src/server');
const pg = require('../src/models/database');

const mockRequest = supertest(server);
// jest.setTimeout(8000);




describe('jest working', () => {
  it('here', () => {
    expect('test').toBe('test');
  });
});

describe('routes tests', () => {
  beforeAll(async () => {
    return pg.connect();
  });




  it('test', () => {

    return mockRequest.post('/signin').send({ email: 'demop@gmail.com', password: '123456' }).then((test) => {
      console.log('aaaaaaaaa', test.body);
      expect(test.status).toEqual(202);
    });
  });
});