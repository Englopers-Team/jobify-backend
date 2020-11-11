'use struct';

const supergoose = require('@code-fellows/supergoose');
const app = require('../src/server');
const mockRequest = supergoose(app.server);
const pg = require('../src/models/database');

let token;

describe('Search', () => {
  beforeAll(async () => {
    await pg.connect();
  });
  afterAll(async () => {
    await pg.end();
  });

  it('Can search for a job', () => {
    return mockRequest.get('/search/job').then((result) => {
      expect(result.status).toBe(200);
    });
  });
  it('Can search for companies', () => {
    return mockRequest.get('/search/company').then((result) => {
      expect(result.status).toBe(200);
    });
  });

  it('Companies can search for employees', () => {
    return mockRequest
      .post('/signin')
      .send({ email: 'democ@gmail.com', password: '123456' })
      .then((result) => {
        token = result.body.token;
      })
      .then(() => {
        return mockRequest
          .get('/search/employee')
          .set('Cookie', [`token=${token}`])
          .then((result) => {
            expect(result.status).toBe(200);
          });
      });
  });
  it('Users can not search for employees', async () => {
    return mockRequest
      .post('/signin')
      .send({ email: 'demop@gmail.com', password: '123456' })
      .then((result) => {
        token = result.body.token;
      })
      .then(() => {
        return mockRequest.get('/search/employee').then((result) => {
          expect(result.status).toBe(500);
          expect(result.text).toBe('{"error":"Access denied"}');
        });
      });
  });

  it('Unregistered users can not search for employees', async () => {
    return mockRequest.get('/search/employee').then((result) => {
      expect(result.status).toBe(500);
      expect(result.text).toBe('{"error":"Access denied"}');
    });
  });
});
