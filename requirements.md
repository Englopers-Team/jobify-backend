# Software Requirements

### Vision

Day by day the unemployment issue became a big problem in the world, although that there are so many platforms that help people find jobs, they are too many to follow and a bit complicated in some way , so our plan is to make an employment hub that combine all jobs from different sources in one place and make this process as much easier as it could be.

### Scope \(In/Out\)

* The web app will provide Jobs for jobs-seekers and give them the ability to apply for them
* The web app gives the users or companies the ability to sign up and have an account with certain authorities.
* Users will be able search for companies to see their information.
* Companies are able to post new job offers
* This web app will not be able to add advertisements.

## Minimum Viable Product vs

A full crud app with authentication and authorizations system, having a notification system What are your stretch goals? Payment gateway, messaging system, PDF reader

## Functional Requirements

An admin can create and delete user accounts A user can update their profile information A user can search all of the jobs in the web app A user can apply to a certain job A user can see his/her submitted job applications. A user can delete certain job application A company can search for employees in the webapp A company can post job offers A company can receive job applications from users A user or company can sign-in/ sign-up by google, Facebook and LinkedIn

## Data Flow

When a guest visits the webapp, he/she can search for a job, so when he clicks the search button a get request will send to the server that will get the requested data from that database process it sends it back to the response as a json file.

## Non-Functional Requirements

**Security** We are going to use Oauth system to let users login to our webapp without using a password, even they sign up using a username and password we will encrypt the password before even storing it to the database using libraries like bcrypt, also the using of jwt to send the token between the front end and the server will add another security layer to our webapp.

**Testability** We will test each function in our app using libraries like jest and supergoose to make sure that our app is working properly under any case scenario, also libraries like eslint will test any syntax errors before the code is pushed to the repo.

