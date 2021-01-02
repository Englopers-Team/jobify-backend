DROP TABLE IF EXISTS experience,education,courses;
CREATE TABLE IF NOT EXISTS experience (
id SERIAL PRIMARY KEY,
title VARCHAR(255),
company VARCHAR(255),
field VARCHAR(255),
starting_date VARCHAR(255),
ending_date VARCHAR(255),
present BOOLEAN DEFAULT '0',
location VARCHAR(255),
description TEXT,
logo TEXT DEFAULT 'https://dl.dropboxusercontent.com/s/qtp98l04985tvh0/company.jpg?dl=0',
person_id INT REFERENCES person (id)
); 

CREATE TABLE IF NOT EXISTS education (
id SERIAL PRIMARY KEY,
school VARCHAR(255),
degree VARCHAR(255),
field VARCHAR(255),
starting_date VARCHAR(255),
ending_date VARCHAR(255),
present BOOLEAN DEFAULT '0',
grade FLOAT(2),
description TEXT,
logo TEXT DEFAULT 'https://dl.dropboxusercontent.com/s/n0vrkkyyf0f1130/school.jpg?dl=0',
person_id INT REFERENCES person(id)
);

CREATE TABLE IF NOT EXISTS courses (
id SERIAL PRIMARY KEY,
course_name VARCHAR(255),
field VARCHAR(255),
course_date date,
school VARCHAR(255),
person_id INT REFERENCES person (id)
);

ALTER TABLE person
ADD sammary TEXT DEFAULT 'Profile sammary';

ALTER TABLE person
ADD cover_letter TEXT DEFAULT 'Cover letter';

INSERT INTO education (school,degree,field,starting_date,ending_date,present,grade,description,person_id) VALUES('ASAC','Diploma','Software Enginnering',2020,2021,'0',93.3,'Boot camp',1);

INSERT INTO experience (title,company,field,starting_date,ending_date,present,location,description,person_id) VALUES('Full stack','Aspire','Software Enginnering',2018,2020,'0','Amman','Top Tech company',1);

INSERT INTO courses (course_name,field,course_date,school,person_id) VALUES('Java','Software Enginnering','2018-05-11','ASAC',1);

INSERT INTO education (school,degree,field,starting_date,ending_date,present,grade,description,person_id) VALUES('ASAC','Diploma','Software Enginnering',2020,2021,'0',93.3,'Boot camp',3);

INSERT INTO experience (title,company,field,starting_date,ending_date,present,location,description,person_id) VALUES('Full stack','Aspire','Software Enginnering',2018,2020,'0','Amman','Top Tech company',3);

INSERT INTO courses (course_name,field,course_date,school,person_id) VALUES('Java','Software Enginnering','2018-05-11','ASAC',3);