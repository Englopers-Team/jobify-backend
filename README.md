# Jobify-app



### Problem Domain

Day by day the unemployment issue became a big problem in the world, although that there are so many platforms that help people find jobs, they are too many to follow and a bit complicated in some way , so our plan is to make an employment hub that combine all jobs from different sources in one place and make this process as much easier as it could be.

## Application features

### Employee

#### Dashboard

| Method | Endpoint | Description  |
| :---: | :--- | :--- |
| GET | /home | Used to get the suggestion jobs, the number of applied applications, and the received offers.  |

#### Applications

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /user/app | Used to get all the applied applications. |
| GET | /user/app/:id | Used to get one of the applied applications. |
| DELETE | /user/app/:id | Used to delete one of the applied applications. |

#### Offers

| Method  | Endpoint | Description  |
| :--- | :--- | :--- |
| GET | user/offers | Used to get all the received offers. |
| PUT | user/offers/:id | Used to answer one of the received offers |

#### Apply

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | user/apply/:id | Used to apply on a job offer. |

#### Search 

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /job | Used to search for a job by the job title and location. |
| GET | /company | Used to search for a company by the title and location. |

## Group members:

* **Abdallah Zakaria**
* **Abdulhakim Zatar**
* **Mohmmad Al-Esseili**
* **Osama Althabteh**

 

## Project Management Tool

[Trello](https://trello.com/invite/b/qdMApvNd/146e1a2ec506e1d8b85d87decc563a76/englopers-jobify-v2)

