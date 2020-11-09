'use strict';

const supertest = require('supertest');
const { server } = require('../src/server');
const pg = require('../src/models/database');

const mockRequest = supertest(server);
let token, token2, token3;


describe('Authentication', () => {
  beforeAll(async () => {
    pg.connect();
    await pg.query(`DROP TABLE IF EXISTS auth, person, company, applications, jobs, job_offers, admin_reports, notifications, applications_api,saved_jobs; CREATE TABLE IF NOT EXISTS auth( id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE, password VARCHAR(255), account_type VARCHAR(255), account_status VARCHAR(255) DEFAULT 'pending', verify_token VARCHAR(255)); CREATE TABLE IF NOT EXISTS person ( id SERIAL PRIMARY KEY, first_name VARCHAR(255), last_name VARCHAR(255), phone VARCHAR(255), job_title VARCHAR(255), country VARCHAR(255), age INT DEFAULT 23, avatar VARCHAR(255) DEFAULT 'https://library.kissclipart.com/20180929/ooq/kissclipart-avatar-person-clipart-avatar-computer-icons-person-87355c56a1748473.jpg', experince VARCHAR(255) DEFAULT '0', cv VARCHAR(255) DEFAULT 'Edit your profile', auth_id INT REFERENCES auth (id) ); CREATE TABLE IF NOT EXISTS company ( id SERIAL PRIMARY KEY, company_name VARCHAR(255), phone VARCHAR(255), company_url VARCHAR(255), logo VARCHAR(255) DEFAULT 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', country VARCHAR(255), auth_id INT REFERENCES auth (id) ); CREATE TABLE IF NOT EXISTS jobs ( id SERIAL PRIMARY KEY, title VARCHAR(255), location VARCHAR(255), type VARCHAR(255), description TEXT, company_id INT REFERENCES company (id) ); CREATE TABLE IF NOT EXISTS applications_api ( id SERIAL PRIMARY KEY, title VARCHAR(255), location VARCHAR(255), type VARCHAR(255), company_name VARCHAR(255), logo VARCHAR(255), status VARCHAR(255) DEFAULT 'Submitted', person_id INT REFERENCES person (id) ); CREATE TABLE IF NOT EXISTS applications ( id SERIAL PRIMARY KEY, status VARCHAR(255) DEFAULT 'Pending', person_id INT REFERENCES person (id), job_id INT REFERENCES jobs (id), company_id INT REFERENCES company (id) ); CREATE TABLE IF NOT EXISTS saved_jobs ( id SERIAL PRIMARY KEY, title VARCHAR(255), location VARCHAR(255), type VARCHAR(255), description TEXT, company_name VARCHAR(255), phone VARCHAR(255), company_url VARCHAR(255), logo VARCHAR(255) DEFAULT 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', country VARCHAR(255), job_id INT REFERENCES jobs (id) UNIQUE, person_id INT REFERENCES person (id) ); CREATE TABLE IF NOT EXISTS job_offers ( id SERIAL PRIMARY KEY, title VARCHAR(255), location VARCHAR(255), type VARCHAR(255), description TEXT, status VARCHAR(255) DEFAULT 'Pending', person_id INT REFERENCES person (id), company_id INT REFERENCES company (id) ); CREATE TABLE IF NOT EXISTS admin_reports ( id SERIAL PRIMARY KEY, description TEXT, response TEXT, auth_id INT REFERENCES auth (id) ); CREATE TABLE IF NOT EXISTS notifications ( id SERIAL PRIMARY KEY, title VARCHAR(255), description TEXT, seen VARCHAR(255), auth_id INT REFERENCES auth (id) ); INSERT INTO auth (email,password,account_type,account_status) VALUES('demop@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active'); INSERT INTO auth (email,password,account_type,account_status) VALUES('democ@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active'); INSERT INTO auth (email,password,account_type,account_status) VALUES('demop2@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','pending'); INSERT INTO auth (email,password,account_type,account_status) VALUES('democ2@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active'); INSERT INTO auth (email,password,account_type,account_status) VALUES('demop3@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','blocked'); INSERT INTO auth (email,password,account_type,account_status) VALUES('democ3@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active'); INSERT INTO auth (email,password,account_type,account_status) VALUES('demoadmin@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','admin','active'); INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Malek','Ahmed','0790278534','Developer','USA',24,'https://library.kissclipart.com/20180929/ooq/kissclipart-avatar-person-clipart-avatar-computer-icons-person-87355c56a1748473.jpg','5','https://www.docdroid.net/izBd6Li/cv-pdf', 1); INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Malek','Ahmed','0790278534','civil eng','Jordan',26,'https://library.kissclipart.com/20180929/ooq/kissclipart-avatar-person-clipart-avatar-computer-icons-person-87355c56a1748473.jpg','5','https://www.docdroid.net/izBd6Li/cv-pdf', 3); INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Malek','Ahmed','0790278534','civil eng','Jordan',26,'https://library.kissclipart.com/20180929/ooq/kissclipart-avatar-person-clipart-avatar-computer-icons-person-87355c56a1748473.jpg','5','https://www.docdroid.net/izBd6Li/cv-pdf', 5); INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Demo Company', '079028555', 'www.demo.com', 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', 'USA', 2); INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Demo Company', '079028555', 'www.demo.com', 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', 'KSA', 4); INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Demo Company', '079028555', 'www.demo.com', 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', 'KSA', 6); INSERT INTO jobs (title,location,type,description,company_id) VALUES ('Developer','Jordan','Full Time','A full time job with 900jd salary.',1); INSERT INTO jobs (title,location,type,description,company_id) VALUES ('Developer','usa','Full Time (iam from database)','A full time job with 900jd salary.',3); INSERT INTO jobs (title,location,type,description,company_id) VALUES ('civil eng','Jordan','Full Time (iam from database)','A full time job with 100jd salary 24hour wooork.',2); INSERT INTO jobs (title,location,type,description,company_id) VALUES ('civil eng','ksa','Full Time (iam from database)','A full time job with 900jd salary 24hour wooork.',2); INSERT INTO jobs (title,location,type,description,company_id) VALUES ('civil eng','uae','Full Time (iam from database)','A full time job with 1000jd salary 24hour wooork.',2); INSERT INTO jobs (title,location,type,description,company_id) VALUES ('mechanical eng','uae','Full Time (iam from database)','A full time job with 1000jd salary 24hour wooork.',1); INSERT INTO jobs (title,location,type,description,company_id) VALUES ('Developer','Jordan','Full Time','A full time job with 900jd salary.',2); INSERT INTO jobs (title,location,type,description,company_id) VALUES ('Developer','usa','Full Time (iam from database)','A full time job with 900jd salary.',1); INSERT INTO jobs (title,location,type,description,company_id) VALUES ('accounting','Jordan','Full Time (iam from database)','A full time job with 100jd salary 24hour wooork.',3); INSERT INTO jobs (title,location,type,description,company_id) VALUES ('accounting','ksa','Full Time (iam from database)','A full time job with 900jd salary 24hour wooork.',1); INSERT INTO applications (status,person_id,job_id,company_id) VALUES ('Pending', 1,1,3); INSERT INTO applications (status,person_id,job_id,company_id) VALUES ('Pending', 1,2,1); INSERT INTO applications (status,person_id,job_id,company_id) VALUES ('Pending', 1,3,2); INSERT INTO applications (status,person_id,job_id,company_id) VALUES ('Pending', 1,4,3); INSERT INTO applications (status,person_id,job_id,company_id) VALUES ('Pending', 1,5,1); INSERT INTO applications_api (title,location,type,company_name,person_id) VALUES ('developer','jordan','full time','zeko co',1); INSERT INTO job_offers (title,location,type,description,status,person_id,company_id) VALUES ('Web Dev','Jordan','Full Time','500 salary','Pending',1,2); INSERT INTO job_offers (title,location,type,description,status,person_id,company_id) VALUES ('Web Dev','Jordan','Full Time','500 salary','Accepted',1,1); INSERT INTO job_offers (title,location,type,description,status,person_id,company_id) VALUES ('backEnd Dev','Jordan','Full Time','500 salary','Accepted',1,3); INSERT INTO job_offers (title,location,type,description,status,person_id,company_id) VALUES ('frontEnd Dev','Jordan','Full Time','500 salary','Rejected',1,2); INSERT INTO job_offers (title,location,type,description,status,person_id,company_id) VALUES ('frontEnd Dev','Jordan','Full Time','500 salary','Rejected',1,1);INSERT INTO notifications (title,description,seen,auth_id) VALUES ('Offer','You got an offer from company name','false',1); INSERT INTO admin_reports (description,response,auth_id) VALUES ('i am report from person',null,1); INSERT INTO admin_reports (description,response,auth_id) VALUES ('i am report from company num1',null,2); INSERT INTO admin_reports (description,response,auth_id) VALUES ('i am report from company num2',null,2); INSERT INTO notifications (title,description,seen,auth_id) VALUES ('Offer','You got an offer from company name','false',1); `);
  });

  afterAll(async () => {
    pg.end();
  });

  beforeEach(async () => {
    await mockRequest.post('/signin').send({ email: 'demop@gmail.com', password: '123456' }).then((result) => {
      token = result.body.token;
    });
    await mockRequest.post('/signin').send({ email: 'demop2@gmail.com', password: '123456' }).then((result) => {
      token2 = result.body.token;
    });
    await mockRequest.post('/signin').send({ email: 'demop3@gmail.com', password: '123456' }).then((result) => {
      token3 = result.body.token;
    });
  });

  it('Signin route with correct data', () => {
    return mockRequest.post('/signin').send({ email: 'demop@gmail.com', password: '123456' }).then((result) => {
      expect(result.status).toEqual(202);
    });
  });

  it('Signin route with empty data', () => {
    return mockRequest.post('/signin').then((result) => {
      expect(result.status).toEqual(500);
    });
  });

  it('Signin route with wrong data', () => {
    return mockRequest.post('/signin').send({ email: 'demcop@gmail.com', password: '123456' }).then((result) => {
      expect(result.status).toEqual(500);
    });
  });

  it('Logout route', () => {
    return mockRequest.get('/logout').then((result) => {
      expect(result.status).toEqual(202);
    });
  });
  let signupToken;
  it('Signup route employee', () => {
    const record = {
      'email': 'testp@gmail.com',
      'password': '123456',
      'account_type': 'p',
      'first_name': 'test',
      'last_name': 'test',
      'phone': '123',
      'job_title': 'test',
      'country': 'test',
    };
    return mockRequest.post('/signup').send(record).then((result) => {
      signupToken = result.headers['set-cookie'][0].slice(6);
      signupToken = signupToken.slice(0, -8);
      expect(result.status).toEqual(201);
    });
  });

  it('Verfiy email with wrong token', async () => {
    return mockRequest.get(`/verify/134`).set('Cookie', [`token=${signupToken}`]).then((result) => {
      expect(result.status).toEqual(500);
    });
  });

  it('Verfiy email with correct token', async () => {
    const result = await pg.query(`SELECT verify_token FROM auth WHERE email='testp@gmail.com';`);
    const verify_token = result.rows[0].verify_token;
    return mockRequest.get(`/verify/${verify_token}`).set('Cookie', [`token=${signupToken}`]).then((result) => {
      expect(result.status).toEqual(201);
    });
  });

  it('Signup route company', () => {
    const record = {
      'email': 'testc@gmail.com',
      'password': '123456',
      'account_type': 'c',
      'company_name': 'test',
      'logo': 'test',
      'phone': '123',
      'company_url': 'test',
      'country': 'jo',
    };
    return mockRequest.post('/signup').send(record).then((result) => {
      // signupToken = result.headers['set-cookie'][0].slice(6);
      // signupToken = signupToken.slice(0, -8);
      expect(result.status).toEqual(201);
    });
  });

  it('Bearer middleware with active account', () => {
    return mockRequest.get('/test').set('Cookie', [`token=${token}`]).then((result) => {
      expect(result.status).toEqual(200);
    });
  });
  it('Bearer middleware with pending account', () => {
    return mockRequest.get('/test').set('Cookie', [`token=${token2}`]).then((result) => {
      expect(result.status).toEqual(500);
    });
  });
  it('Bearer middleware with blocked account', () => {
    return mockRequest.get('/test').set('Cookie', [`token=${token3}`]).then((result) => {
      expect(result.status).toEqual(500);
    });
  });
  it('Bearer middleware with no cookie', () => {
    return mockRequest.get('/test').then((result) => {
      expect(result.status).toEqual(500);
    });
  });
});