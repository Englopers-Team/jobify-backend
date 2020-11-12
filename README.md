# Jobify-app


## Group members

* **Abdallah Zakaria**
* **Abdulhakim Zatar**
* **Mohmmad Al-Esseili**
* **Osama Althabteh**

## Problem Domain

Day after day, unemployment has become a big issue that threatens everyone, especially in the hard circumstances that the world is going through due to COVID19 pandemic, although that there are too many websites that help people find jobs, they are too many to follow and a bit complicated in some way , so our plan is to make an employment hub that combine all jobs from different sources in one place and make this process as much easier as it could be.

## UML

![](https://lh4.googleusercontent.com/73DQOk0QA-DgWjFY_EF7o_C_mxRCgsLc2EC_BzoJ2wUexccnOZR6iYvQduNud-wKvNKHyNwnG4bGJbRbuGFL9xpyyPDmG14qoYDQ67ANnuJXNDlb1AXAFQV63AKjz6c4BpfvCER7r8w)

## Database Model Diagram



![](https://lh4.googleusercontent.com/2-SadErliV_clHl9nbgnG1aPCKZ0jHyH6rLcmR4k6opVDO-R8pBA2a_xJ0F4a2huSyKtfnj0CzVrK4TkLNWMWRkOo7FI1409SY1ZmMVNBU-F3hKsKMcY77Gimk8GCCVuw8GRxVxXgHE)

![](https://lh4.googleusercontent.com/ei0JmXX5utpsZuMCNpZKYvS_WCkUeZzlzAHEXWprW38Nt5WNjsrNCGlEFx61TxGeuvG0Zqk2yPg4O1zSuK4JsCXNVsg2Duz9_kU7kZaDV6DzTnmRH1_ufahqhr45nz5qTL9wgWcDpFQ)

## Project Management Tool

[Trello](https://trello.com/invite/b/qdMApvNd/146e1a2ec506e1d8b85d87decc563a76/englopers-jobify-v2)

## Features & Routes

### Applicant

#### Dashboard

| Method | Endpoint | Description  |
| :---: | :--- | :--- |
| GET | /home | Used to get the suggestion jobs, the number of applied applications, the received offers, messages, and the notifications. |

#### Applications

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /user/app | Used to get all the employee applied applications. |
| GET | /user/app/:id | Used to get one of the employee applied applications. |
| DELETE | /user/app/:id | Used to delete one of the applied applications. |

#### Offers

| Method  | Endpoint | Description  |
| :--- | :--- | :--- |
| GET | /user/offers | Used to get all the employee received offers. |
| PUT | /user/offers/:id | Used to answer one of the received offers |

#### Apply

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /user/apply/:id | Used to apply on a job offer. |

#### Search 

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /job | Used to search for a job by the job title and location. |
| GET | /company | Used to search for a company by the title and location. |

#### Save

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /user/saved | Used to get all the employee saved jobs. |
| POST | /user/save | Used to save one of jobs. |

#### Reports

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /report | Used to send a report to the support. |
| GET | /reports | Used to get all the employee reports. |
| GET | /report/:id | Used to get one of the employee reports. |

#### Upload

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /upload/profile\_pic | Used to upload the employee profile picture. |
| POST | /upload/cv | Used to upload and scan the employee resume. |

#### Edit Profile

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| PUT | /user/edit | Used to update the employee profile information. |



### Company

#### Dashboard

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /home | Used to get all the company job applications, job offers, messages, and the notifications. |

#### Applications

| Method | Endpoint | Descriptions |
| :--- | :--- | :--- |
| GET | /company/app | Used to get all the company received applications. |
| PUT | /company/app/:id | Used to answer one of the received application. |

#### Offers

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /company/offers | Used to get all the company sent offers. |
| POST | /company/offers/:id | Used to send a new offer. |
| DELETE | /company/offers/:id | Used to delete one of the company sent offers. |

#### Jobs

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /company/jobs | Used to get all the company posted jobs. |
| POST | /company/submit | Used to post new job. |
| PUT | /company/jobs/:id | Used to update one of the company posted jobs. |
| DELETE | /company/jobs/:id | Used to delete one of the company posted jobs. |

#### Search

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /employee | Used to search for employees by the job title and location. |

#### Reports

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /report | Used to send a report to the support. |
| GET | /reports | Used to get all the company reports. |
| GET | /report/:id | Used to get one of the company reports. |

#### Edit Profile

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| PUT | /company/edit | Used to update the company profile information. |

## 

### Admin

#### Dashboard

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | / | Used to get all the website statistics. |

#### Block

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| PATCH | /admin/block/:id | Used to ban users. |
| PATCH | /admin/removeBlock/:id | Used to Unban users. |

#### Reports

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /admin/report | Used to get all the received reports from employees and companies. |
| GET | /admin/report/:id | Used to get one of the received reports from employees and companies. |
| PATCH | /admin/report/:id | Used to update one of the received reports from employees and companies. |
| DELETE | /admin/report/:id | Used to delete one of the received reports from employees and companies. |

#### Posts

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /admin/posts | Used to get all the posted posts from community. |
| GET | /admin/posts/:id | Used to get one of the posted posts from community. |
| PATCH | /admin/posts/:id | Used to pin one of the posted posts from community. |
| DELETE | /admin/posts/:id | Used to delete one of the posted posts from community. |

#### Seed Data

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | admin/seed | Used to insert post jobs by the admin to the platform. |

## 

### Community



#### Dashboard

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | / | Used to get all data for the user. |
| GET | /search | Used to search for a post by typing keywords related to the subject. |

#### 

#### Post

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /post/:id | Used to get  an added Post . |
| POST | /submit | Used to post submit new post. |
| PATCH | /post/:id | Used to update an added post. |
| DELETE | /post/:id | Used to delete an added post |

#### Comment

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /comment/:id | Used to post a new comment on an added Post . |
| DELETE | /comment/:id | Used to delete an added comment. |

#### Like

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /like/:id | Used to add a new like on an added Post . |

## 

### Authentication

#### Basic authenticate

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | /signin | Authorize users to the platform. |
| POST | /signup | Register user as recruiter or applicate. |
| GET | /logout | Logout user from platform and clear his/her cookies. |

#### Verify

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /verify/:token | Verify user by generated token sent to his/her email. |

### 

### Messages

Listening to **messages** namespace

* The company can start offer-chat with any employee in the platform then the employee will be able to chatting with that company in real time event.
* When the user get back online all of unseen messages will appear.
* User will have the ability to get the messages history.

## 

### Notifications

Listening to **notification** namespace

* The employee will notified in real time event when received a job offer. 
* the company will notified in real time event when received a job application. 
* User will have the ability to get the notification history.

## 

### API

Fetching data from other's platform

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/v1/jobs | Used to fetch all jobs in the platform. |
| GET | /api/v1/companies | Used to fetch all companies in the platform. |
| GET | /api/v1/employees | Used to fetch all employee in the platform. |

## Tests

![](https://lh5.googleusercontent.com/-dXOrp8lF93wUJXoR4yMmsZWQgXIhXsZ_s_2skFpXiS3xtupPyQpw8O02MiIUiE55JfMh-lHjtKOS_HRe5KKiu-mISKioEyymmGaKfBRSiNATSo3nGxHgV_VKlQTrzzIL3g2mNuz2lM)

## **Technology**

![](https://lh3.googleusercontent.com/Fk17Hu3uuPEZFHAX8GHaATK7pymdXQFJK5s7i2-NbyBuFJsE_2OUQt2bw7g-2iB49etSuxt5uFS6qQKBy6JtoK5Pq2iOeugrow1o_rU6WGa1PwWKhue0CEh_YCWMBIrJzlnb86irSGc)

![Raspberry Pi Robot: Using SocketIO to Connect our Robot and Controller](https://lh4.googleusercontent.com/uFbsYTjRWMKg31Ikhb8FOTLELKAgLtXTrZEGP2b_TyobXjt9yx0bQMinji_IwOs5xtI7Q0n_j4R_4O0k67cF4nYD1XqYOoO2Ig4eRG3KV0IS-AmlbvzRbt926cbZ1nwMtjLhoJVqkLw)

![](https://lh4.googleusercontent.com/hkaNFwx1P91F6BQsv-OVd-C-h4GCxLOggZ9irOEEWnjMifzS7jqzwfj6PwUTaJ6yUcZ0OueRuiZQRRXwqQWuHciwZZmhl0cAyHgfIOy-TAF3m3vob15IqBS_vZYUTla_137YNervs3A)

![](https://lh3.googleusercontent.com/_SE-bkGbmUDH0A6VCtj1R8fRS9HWYb7O_Z9SrgU_R8HAeMRbDisJih1wDX5YHPSWn1w-Z-cuyMjoneTnlJmn7Mx5tmXShB0UsLgog90oDl1gn9c-1E88pjGg46J0y6CExmIBSwMGA9Q)

![MongoDB logo and symbol, meaning, history, PNG](https://lh6.googleusercontent.com/IHA2SvvsKeVykQ0QpHQk1dCYSGX2THC4mQ3LjiwMfgE5EJ0i7fQSnRfLPa9KxFYLTtqglMWjl4UORDYwt4qNZ6rQdreMWprzmIoF9BAXZbnV_qXKMjU6FiRW6xnlaPVhyv0f2_AzlzY)

## Deployed app link
[Link](https://jobify-app-v2.herokuapp.com/)

 

## 

