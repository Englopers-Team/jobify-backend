'use strict';

const supergoose = require('@code-fellows/supergoose');
const app = require('../src/server');
const mockRequest = supergoose(app.server);
const pg = require('../src/models/database');

describe('Community', () => {
  let token;
  beforeEach(async () => {
    await mockRequest.post('/signin').send({ email: 'demop@gmail.com', password: '123456' }).then((result) => {
      token = result.body.token;
    });
  });

  beforeAll(() => {
    pg.connect();
  });

  afterAll(async () => {
    pg.end();
  });

  it('Community homepage', () => {
    return mockRequest.get('/community').set('Cookie', [`token=${token}`]).then((result) => {
      expect(result.status).toBe(200);
    });
  });

  it('Community search', () => {
    return mockRequest.get('/community/search?title=cv').set('Cookie', [`token=${token}`]).then((result) => {
      expect(result.status).toBe(200);
    });
  });

  it('Community submit post', () => {
    return mockRequest.post('/community/submit').set('Cookie', [`token=${token}`]).send({
      title: 'test',
      body: 'test',
    }).then((result) => {
      expect(result.status).toBe(201);
    });
  });

  it('Community submit empty post', () => {
    return mockRequest.post('/community/submit').set('Cookie', [`token=${token}`]).then((result) => {
      expect(result.status).toBe(500);
    });
  });

  it('Community view exist specific post', () => {
    return mockRequest.post('/community/submit').set('Cookie', [`token=${token}`]).send({
      title: 'test',
      body: 'test',
    }).then((result) => {
      return mockRequest.get(`/community/post/${result.body._id}`).set('Cookie', [`token=${token}`]).then((result) => {
        expect(result.status).toBe(200);
      });
    });
  });

  it('Community view nonexistent specific post', () => {
    return mockRequest.get('/community/post/999').set('Cookie', [`token=${token}`]).then((result) => {
      expect(result.status).toBe(500);
    });
  });

  it('Community user delete correct post', () => {
    return mockRequest.post('/community/submit').set('Cookie', [`token=${token}`]).send({
      title: 'test',
      body: 'test',
    }).then((result) => {
      return mockRequest.delete(`/community/post/${result.body._id}`).set('Cookie', [`token=${token}`]).then((result) => {
        expect(result.status).toBe(202);
      });
    });
  });

  it(`Community user can't delete wrong post`, () => {
    return mockRequest.delete(`/community/post/99`).set('Cookie', [`token=${token}`]).then((result) => {
      expect(result.status).toBe(500);
    });
  });

  it('Community user update correct post', () => {
    return mockRequest.post('/community/submit').set('Cookie', [`token=${token}`]).send({
      title: 'test',
      body: 'test',
    }).then((result) => {
      return mockRequest.patch(`/community/post/${result.body._id}`).set('Cookie', [`token=${token}`]).send({
        title: 'test',
        body: 'test',
      }).then((result) => {
        expect(result.status).toBe(201);
      });
    });
  });

  it(`Community user can't update wrong post`, () => {
    return mockRequest.patch(`/community/post/99`).set('Cookie', [`token=${token}`]).then((result) => {
      expect(result.status).toBe(500);
    });
  });

  it('Community user submit comment on exist post', () => {
    return mockRequest.post('/community/submit').set('Cookie', [`token=${token}`]).send({
      title: 'test',
      body: 'test',
    }).then((result) => {
      return mockRequest.post(`/community/comment/${result.body._id}`).set('Cookie', [`token=${token}`]).send({
        comment: 'test',
      }).then((result) => {
        expect(result.status).toBe(201);
      });
    });
  });

  it(`Community user can't comment on nonexistent post`, () => {
    return mockRequest.post(`/community/comment/99`).send({
      comment: 'test',
    }).set('Cookie', [`token=${token}`]).then((result) => {
      expect(result.status).toBe(500);
    });
  });

  it('Community user delete comment', () => {
    return mockRequest.post('/community/submit').set('Cookie', [`token=${token}`]).send({
      title: 'test',
      body: 'test',
    }).then((result) => {
      return mockRequest.post(`/community/comment/${result.body._id}`).set('Cookie', [`token=${token}`]).send({
        comment: 'test',
      }).then((data) => {
        return mockRequest.delete(`/community/comment/${result.body._id}`).set('Cookie', [`token=${token}`]).send({
          commentID: data.body.commentID,
        }).then((result) => {
          expect(result.status).toBe(202);
        });
      });
    });
  });

  it(`Community user can't delete comment if not his/her comment`, () => {
    return mockRequest.post('/community/submit').set('Cookie', [`token=${token}`]).send({
      title: 'test',
      body: 'test',
    }).then((result) => {
      return mockRequest.post(`/community/comment/${result.body._id}`).set('Cookie', [`token=${token}`]).send({
        comment: 'test',
      }).then((data) => {
        return mockRequest.delete(`/community/comment/${result.body._id}`).set('Cookie', [`token=${token}`]).send({
          commentID: 99,
        }).then((result) => {
          expect(result.status).toBe(500);
        });
      });
    });
  });

  it('Community user like exist post', () => {
    return mockRequest.post('/community/submit').set('Cookie', [`token=${token}`]).send({
      title: 'test',
      body: 'test',
    }).then((result) => {
      return mockRequest.patch(`/community/like/${result.body._id}`).set('Cookie', [`token=${token}`]).then((result) => {
        expect(result.status).toBe(201);
      });
    });
  });

  it(`Community user can't like nonexistent post`, () => {
    return mockRequest.post('/community/submit').set('Cookie', [`token=${token}`]).send({
      title: 'test',
      body: 'test',
    }).then((result) => {
      return mockRequest.patch(`/community/like/95`).set('Cookie', [`token=${token}`]).then((result) => {
        expect(result.status).toBe(500);
      });
    });
  });

});