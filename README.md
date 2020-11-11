# Jobify-app



### Problem Domain

Day by day the unemployment issue became a big problem in the world, although that there are so many platforms that help people find jobs, they are too many to follow and a bit complicated in some way , so our plan is to make an employment hub that combine all jobs from different sources in one place and make this process as much easier as it could be.

## Application features

{% api-method method="get" host="" path="" %}
{% api-method-summary %}

{% endapi-method-summary %}

{% api-method-description %}

{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="" type="string" required=false %}

{% endapi-method-parameter %}
{% endapi-method-path-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```

```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

### Employee

{% api-method method="get" host="https://jobify-app-v2.herokuapp.com" path="/home" %}
{% api-method-summary %}
Dashboard
{% endapi-method-summary %}

{% api-method-description %}
The employee will receive a suggestion jobs regarding to his information and number of his application and  offers
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-form-data-parameters %}
{% api-method-parameter name="token " type="string" required=false %}
token represent the user 
{% endapi-method-parameter %}
{% endapi-method-form-data-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}
Dashboard information
{% endapi-method-response-example-description %}

```
{
        "suggJob": {
                "resultDB": [],
                "resultAPI": []
        },numOfApp": ,
        "numOfOffer": ,
        "notifications": []
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

## Group members:

* **Abdallah Zakaria**
* **Abdulhakim Zatar**
* **Mohmmad Al-Esseili**
* **Osama Althabteh**

 

## Project Management Tool

[Trello](https://trello.com/invite/b/qdMApvNd/146e1a2ec506e1d8b85d87decc563a76/englopers-jobify-v2)

