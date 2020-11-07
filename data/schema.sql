DROP TABLE IF EXISTS auth, person, company, applications, jobs, job_offers, admin_reports;
CREATE TABLE IF NOT EXISTS auth (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    account_type VARCHAR(255),
    account_status VARCHAR(255) DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS person (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    phone VARCHAR(255),
    job_title VARCHAR(255),
    country VARCHAR(255),
    age INT DEFAULT 23,
    avatar VARCHAR(255) DEFAULT 'https://library.kissclipart.com/20180929/ooq/kissclipart-avatar-person-clipart-avatar-computer-icons-person-87355c56a1748473.jpg',
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
    company_id INT REFERENCES company (id)
);
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    status VARCHAR(255) DEFAULT 'Pending',
    person_id INT REFERENCES person (id),
    job_id INT REFERENCES jobs (id),
    company_id INT REFERENCES company (id)
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
INSERT INTO auth (email,password,account_type,account_status) VALUES('demop@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','p','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('democ@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','c','active');
INSERT INTO auth (email,password,account_type,account_status) VALUES('demoadmin@gmail.com','$2b$05$mmpitpTUVYrZfKYjauH0/efhMGB0UtsbkFBvXPvcs6IQhFSeYSC2K','admin','active');

INSERT INTO person (first_name, last_name, phone, job_title, country, age, avatar, experince, cv, auth_id) VALUES ('Malek','Ahmed','0790278534','Developer','Jordan',24,'https://library.kissclipart.com/20180929/ooq/kissclipart-avatar-person-clipart-avatar-computer-icons-person-87355c56a1748473.jpg','5','https://www.docdroid.net/izBd6Li/cv-pdf', 1);
INSERT INTO company (company_name,phone,company_url,logo,country,auth_id) VALUES ('Demo Company', '079028555', 'www.demo.com', 'https://www.flaticon.com/svg/static/icons/svg/993/993891.svg', 'Jordan', 2);
INSERT INTO jobs (title,location,type,description,company_id) VALUES ('Developer','Jordan','Full Time','A full time job with 900jd salary.',1);
INSERT INTO jobs (title,location,type,description,company_id) VALUES ('Developer','usa','Full Time (iam from database)','A full time job with 900jd salary.',1);
INSERT INTO jobs (title,location,type,description,company_id) VALUES ('civil eng','Jordan','Full Time (iam from database)','A full time job with 100jd salary 24hour wooork.',1);
INSERT INTO jobs (title,location,type,description,company_id) VALUES ('civil eng','ksa','Full Time (iam from database)','A full time job with 900jd salary 24hour wooork.',1);
INSERT INTO jobs (title,location,type,description,company_id) VALUES ('civil eng','uae','Full Time (iam from database)','A full time job with 1000jd salary 24hour wooork.',1);


INSERT INTO applications (status,person_id,job_id,company_id) VALUES ('Pending', 1,1,1);
INSERT INTO job_offers (title,location,type,description,status,person_id,company_id) VALUES ('Web Dev','Jordan','Full Time','500 salary','Pending',1,1);
INSERT INTO admin_reports (description,response,auth_id) VALUES ('i am report from person',null,1);
INSERT INTO admin_reports (description,response,auth_id) VALUES ('i am report from company num1',null,2);
INSERT INTO admin_reports (description,response,auth_id) VALUES ('i am report from company num2',null,2);


