DROP TABLE IF EXISTS auth, person, company, applications, jobs, job_offers, admin_reports, notifications, applications_api, saved_jobs, messages;
CREATE TABLE IF NOT EXISTS auth (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    account_type VARCHAR(255),
    account_status VARCHAR(255) DEFAULT 'pending',
    verify_token VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS person (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(255),
    job_title VARCHAR(255),
    country VARCHAR(255),
    age INT DEFAULT 23,
    avatar VARCHAR(255) DEFAULT 'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg',
    experince VARCHAR(255) DEFAULT '0',
    cv VARCHAR(255) DEFAULT 'Edit your profile',
    auth_id INT REFERENCES auth (id)
);
CREATE TABLE IF NOT EXISTS company (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255),
    phone VARCHAR(255),
    company_url VARCHAR(255),
    logo VARCHAR(255) DEFAULT 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg',
    country VARCHAR(255),
    auth_id INT REFERENCES auth (id)
);
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    location VARCHAR(255),
    type VARCHAR(255),
    description TEXT,
    applicants_num INT DEFAULT 0,
    company_id INT REFERENCES company (id)
);
CREATE TABLE IF NOT EXISTS applications_api (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    location VARCHAR(255),
    type VARCHAR(255),
    company_name VARCHAR(255),
    logo VARCHAR(255),
    status VARCHAR(255) DEFAULT 'Submitted',
    person_id INT REFERENCES person (id)
);
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    status VARCHAR(255) DEFAULT 'Pending',
    person_id INT REFERENCES person (id),
    job_id INT REFERENCES jobs (id),
    company_id INT REFERENCES company (id)
);
CREATE TABLE IF NOT EXISTS saved_jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    location VARCHAR(255),
    type VARCHAR(255),
    description TEXT,
    company_name VARCHAR(255),
    phone VARCHAR(255),
    company_url VARCHAR(255),
    logo VARCHAR(255) DEFAULT 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg',
    country VARCHAR(255),
    job_id INT REFERENCES jobs (id) UNIQUE,
    person_id INT REFERENCES person (id)
);
CREATE TABLE IF NOT EXISTS job_offers (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    location VARCHAR(255),
    type VARCHAR(255),
    description TEXT,
    status VARCHAR(255) DEFAULT 'Pending',
    person_id INT REFERENCES person (id),
    company_id INT REFERENCES company (id)
);
CREATE TABLE IF NOT EXISTS admin_reports (
    id SERIAL PRIMARY KEY,
    description TEXT,
    response TEXT,
    auth_id INT REFERENCES auth (id)
);
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    seen VARCHAR(255),
    auth_id INT REFERENCES auth (id)
);
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    body TEXT NOT NULL,
    person_id INT REFERENCES person (id),
    sender VARCHAR(255),  
    company_id INT REFERENCES company (id)
);
CREATE TABLE IF NOT EXISTS meetings (
    id SERIAL PRIMARY KEY,
    auth_id_company INT REFERENCES auth (id),
    auth_id_person INT REFERENCES auth (id),
    date  VARCHAR(255)
);


INSERT INTO auth (email,password,account_type,account_status) VALUES('demop@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('democ@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demop2@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','pending');
INSERT INTO auth (email,password,account_type,account_status) VALUES('democ2@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demop3@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','blocked');
INSERT INTO auth (email,password,account_type,account_status) VALUES('democ3@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active');

INSERT INTO auth (email,password,account_type,account_status) VALUES('demoadmin@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','admin','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demoeditor@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','editor','active');

INSERT INTO auth (email,password,account_type,account_status) VALUES('demop4@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');


INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Abdallah','Zakaria','0799999999','Javascript Developer','USA',24,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','5','https://www.docdroid.net/izBd6Li/cv-pdf', 1);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Osama','Althabth','0799999999','Javascript Developer','KSA',24,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','5','https://www.docdroid.net/izBd6Li/cv-pdf', 3);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Abdulhakim','Zatar','0799999999','Javascript Developer','Jordan',24,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','5','https://www.docdroid.net/izBd6Li/cv-pdf', 5);
INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('BMW', '0799999999', 'www.bmw.com', 'https://pngimg.com/uploads/bmw_logo/bmw_logo_PNG19707.png', 'USA', 2);
INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Amazon', '0799999999', 'www.amazon.com', 'https://images-na.ssl-images-amazon.com/images/I/31%2BDgxPWXtL.jpg', 'USA', 4);
INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Google', '0799999999', 'www.google.com', 'https://banner2.cleanpng.com/20180728/tju/kisspng-google-logo-business-microsoft-windows-operating-system-5b5cb99e99ca38.3321008115328034866299.jpg', 'Jordan', 6);


INSERT INTO jobs (title,location,type,description,company_id) VALUES ('Developer','Jordan','Full Time','A full time job with 900jd salary.',1);

INSERT INTO jobs (title,location,type,description,company_id, applicants_num) VALUES ('Developer','usa','Full Time (iam from database)','A full time job with 900jd salary.',3,50);
INSERT INTO jobs (title,location,type,description,company_id, applicants_num) VALUES ('civil eng','Jordan','Full Time (iam from database)','A full time job with 100jd salary 24hour wooork.',2,50);
INSERT INTO jobs (title,location,type,description,company_id, applicants_num) VALUES ('civil eng','ksa','Full Time (iam from database)','A full time job with 900jd salary 24hour wooork.',2,50);
INSERT INTO jobs (title,location,type,description,company_id, applicants_num) VALUES ('civil eng','uae','Full Time (iam from database)','A full time job with 1000jd salary 24hour wooork.',2,50);
INSERT INTO jobs (title,location,type,description,company_id, applicants_num) VALUES ('mechanical eng','uae','Full Time (iam from database)','A full time job with 1000jd salary 24hour wooork.',1,50);
INSERT INTO jobs (title,location,type,description,company_id, applicants_num) VALUES ('Developer','Jordan','Full Time','A full time job with 900jd salary.',2,50);
INSERT INTO jobs (title,location,type,description,company_id, applicants_num) VALUES ('Developer','usa','Full Time (iam from database)','A full time job with 900jd salary.',1,50);
INSERT INTO jobs (title,location,type,description,company_id, applicants_num) VALUES ('accounting','Jordan','Full Time (iam from database)','A full time job with 100jd salary 24hour wooork.',3,50);
INSERT INTO jobs (title,location,type,description,company_id, applicants_num) VALUES ('accounting','ksa','Full Time (iam from database)','A full time job with 900jd salary 24hour wooork.',1,50);

INSERT INTO applications (status,person_id,job_id,company_id) VALUES ('Pending', 1,1,3);
INSERT INTO applications (status,person_id,job_id,company_id) VALUES ('Pending', 1,2,1);
INSERT INTO applications (status,person_id,job_id,company_id) VALUES ('Pending', 1,3,2);
INSERT INTO applications (status,person_id,job_id,company_id) VALUES ('Pending', 1,4,3);
INSERT INTO applications (status,person_id,job_id,company_id) VALUES ('Pending', 1,5,1);


INSERT INTO applications_api (title,location,type,company_name,person_id) VALUES ('developer','jordan','full time','zeko co',1);


INSERT INTO job_offers (title,location,type,description,status,person_id,company_id) VALUES ('Web Dev','Jordan','Full Time','500 salary','Pending',1,2);
INSERT INTO job_offers (title,location,type,description,status,person_id,company_id) VALUES ('Web Dev','Jordan','Full Time','500 salary','Accepted',1,1);
INSERT INTO job_offers (title,location,type,description,status,person_id,company_id) VALUES ('backEnd Dev','Jordan','Full Time','500 salary','Accepted',1,3);
INSERT INTO job_offers (title,location,type,description,status,person_id,company_id) VALUES ('frontEnd Dev','Jordan','Full Time','500 salary','Rejected',1,2);
INSERT INTO job_offers (title,location,type,description,status,person_id,company_id) VALUES ('frontEnd Dev','Jordan','Full Time','500 salary','Rejected',1,1);INSERT INTO notifications (title,description,seen,auth_id) VALUES ('Offer','You got an offer from company name','false',1);

INSERT INTO admin_reports (description,response,auth_id) VALUES ('i am report from person',null,1);
INSERT INTO admin_reports (description,response,auth_id) VALUES ('i am report from company num1',null,2);
INSERT INTO admin_reports (description,response,auth_id) VALUES ('i am report from company num2',null,2);
INSERT INTO notifications (title,description,seen,auth_id) VALUES ('Offer','You got an offer from company name','false',1);


INSERT INTO messages (body,person_id,company_id,sender) VALUES ('this is message from company 1 to person 2',2,1,'c');
INSERT INTO messages (body,person_id,company_id,sender) VALUES ('this is message from company 2 to person 2',2,2,'p');
INSERT INTO messages (body,person_id,company_id,sender) VALUES ('this is message from company 3 to person 2',2,3,'p');

INSERT INTO messages (body,person_id,company_id,sender) VALUES ('this is message from company 1 to person 1',1,1,'c');
INSERT INTO messages (body,person_id,company_id,sender) VALUES ('this is message from company 2 to person 1',1,2,'p');
INSERT INTO messages (body,person_id,company_id,sender) VALUES ('this is message from company 3 to person 1',1,3,'c');

INSERT INTO messages (body,person_id,company_id,sender) VALUES ('this is message from company 1 to person 2',2,1,'p');
INSERT INTO messages (body,person_id,company_id,sender) VALUES ('this is message from company 2 to person 2',2,2,'c');
INSERT INTO messages (body,person_id,company_id,sender) VALUES ('this is message from company 3 to person 2',2,3,'p');



INSERT INTO auth (email,password,account_type,account_status) VALUES('democt1@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('democt2@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('democt3@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('democt4@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('democt5@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('democt6@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('democt7@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('democt8@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('democt9@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('democt10@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('democt11@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('democt12@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active');

INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt1@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt2@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt3@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt4@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt5@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt6@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt7@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt8@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt9@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt10@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt11@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt12@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt13@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt14@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt15@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt16@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt17@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt18@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt19@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt20@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt21@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt22@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt23@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demopt24@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');


INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Yman Co.', '079028555', 'www.demo.com', 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', 'KSA', 9);
INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Zatar Co.', '079028555', 'www.demo.com', 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', 'KSA', 10);
INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Osama Co.', '079028555', 'www.demo.com', 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', 'KSA', 11);
INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Zakaria Co.', '079028555', 'www.demo.com', 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', 'KSA', 12);
INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Mohammad Co.', '079028555', 'www.demo.com', 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', 'Jordan', 13);
INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Malek Co.', '079028555', 'www.demo.com', 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', 'Jordan', 14);
INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Nawrs Co.', '079028555', 'www.demo.com', 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', 'UAE', 15);
INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Noor Co.', '079028555', 'www.demo.com', 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', 'USA', 16);
INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Ysar Co.', '079028555', 'www.demo.com', 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', 'Qatar', 17);
INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Faraj Co.', '079028555', 'www.demo.com', 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', 'Egypt', 18);
INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Ysar Co.', '079028555', 'www.demo.com', 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', 'Bahrain', 19);
INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Faraj Co.', '079028555', 'www.demo.com', 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', 'kuwait', 20);

INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Malek','Ahmed','0790278534','Front End Developer','Jordan',24,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','5','https://www.docdroid.net/izBd6Li/cv-pdf', 21);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Mohammad','Ahmed','0790278534','Civil Eng','Jordan',26,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','6','https://www.docdroid.net/izBd6Li/cv-pdf', 22);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Noor','Ahmed','0790278534','Civil Eng','Jordan',26,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','4','https://www.docdroid.net/izBd6Li/cv-pdf', 23);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Omar','Yaseen','0790278534','Front End Developer','USA',24,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','5','https://www.docdroid.net/izBd6Li/cv-pdf', 24);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Rami','Ahmed','0790278534','Front End Developer','USA',26,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','6','https://www.docdroid.net/izBd6Li/cv-pdf', 25);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Sara','Yaseen','0790278534','Front End Developer','Jordan',26,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','4','https://www.docdroid.net/izBd6Li/cv-pdf', 26);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Malek','Ahmed','0790278534','Front End Developer','UAE',24,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','5','https://www.docdroid.net/izBd6Li/cv-pdf', 27);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Mohammad','Ahmed','0790278534','Mechanical Eng','Egypt',26,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','6','https://www.docdroid.net/izBd6Li/cv-pdf', 28);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Noor','Ahmed','0790278534','Accountant','Egypt',26,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','4','https://www.docdroid.net/izBd6Li/cv-pdf', 29);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Omar','Yaseen','0790278534','Back End Developer','Egypt',24,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','5','https://www.docdroid.net/izBd6Li/cv-pdf', 30);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Rami','Ahmed','0790278534','UI UX Designer','Qatar',26,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','6','https://www.docdroid.net/izBd6Li/cv-pdf', 31);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Sara','Yaseen','0790278534','UI UX Designer','kuwait',26,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','4','https://www.docdroid.net/izBd6Li/cv-pdf', 32);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Malek','Mohammad','0790278534','Front End Developer','Jordan',24,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','5','https://www.docdroid.net/izBd6Li/cv-pdf', 33);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Ahmad','Malek','0790278534','Civil Eng','Jordan',26,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','6','https://www.docdroid.net/izBd6Li/cv-pdf', 34);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Noor','Omar','0790278534','Civil Eng','Jordan',26,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','4','https://www.docdroid.net/izBd6Li/cv-pdf', 35);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Ahmed','Yaseen','0790278534','Front End Developer','USA',24,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','5','https://www.docdroid.net/izBd6Li/cv-pdf', 36);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Sara','Rami','0790278534','Front End Developer','USA',26,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','6','https://www.docdroid.net/izBd6Li/cv-pdf', 37);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Ahmed','Yaseen','0790278534','Front End Developer','Jordan',26,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','4','https://www.docdroid.net/izBd6Li/cv-pdf', 38);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Sami','Ahmed','0790278534','Front End Developer','UAE',24,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','5','https://www.docdroid.net/izBd6Li/cv-pdf', 39);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Mohammad','Rami','0790278534','Mechanical Eng','Egypt',26,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','6','https://www.docdroid.net/izBd6Li/cv-pdf', 40);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Noor','Ahmed','0790278534','Accountant','Egypt',26,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','4','https://www.docdroid.net/izBd6Li/cv-pdf', 41);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Omar','Yaseen','0790278534','Back End Developer','Egypt',24,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','5','https://www.docdroid.net/izBd6Li/cv-pdf', 42);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Rami','Ahmed','0790278534','UI UX Designer','Qatar',26,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','6','https://www.docdroid.net/izBd6Li/cv-pdf', 43);
INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Sara','Yaseen','0790278534','Networking Engineer','kuwait',26,'https://www.flaticon.com/svg/static/icons/svg/1077/1077012.svg','4','https://www.docdroid.net/izBd6Li/cv-pdf', 44);

INSERT INTO meetings (auth_id_company,auth_id_person,date) VALUES(2,1,'1/1/2020,12:00:00 AM');
INSERT INTO meetings (auth_id_company,auth_id_person,date) VALUES(4,3,'1/2/2020,12:00:00 AM');
INSERT INTO meetings (auth_id_company,auth_id_person,date) VALUES(8,7,'1/2/2020,5:00:00 PM');
INSERT INTO meetings (auth_id_company,auth_id_person,date) VALUES(6,5,'1/3/2020,5:00:00 PM');