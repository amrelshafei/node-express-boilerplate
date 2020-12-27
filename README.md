# **RESTful API Node Express Boilerplate**

This boilerplate project serves as the base for a RESTful API Node Express server. With Express, the API implements REST principles and is built as a web application on top of existing services with the help of HTTP requests. The application uses services like: 
- **Mongoose**: to perform CRUD operations on resources.
- **Redis**: to cache resources.

A REST architecture style creates a layer on all the operations performed by the API and seperates it from users. This style improves the scalability and flexibility of the API and allows it to evolve independently. All storage data are identified as resources with unique layering classifications and identification. Basically, a resource is an abstraction on any named stored information; items, orders, customers, and etc. For example, an instance of the **Items** resource might have the following fields:  
```javascript
{
  id: "5d3962818452354740c9f17c", 
  name: "Meth Chemistry 101",
  type: "Book",
  price: 10.99
}
// Where the id field identifies the instance from others that follow the Items resource abstraction.
```

## **Requests**

By default, the base address of the The API is `localhost:5000/api`. However this can be changed with the use of dotenv. Through HTTP requests, the API provides a set of endpoints, each with its own unique path, that allow users to execute middleware that communicates underlayer services through perform operations on several resources. There are four basic types of HTTP requests that are used for interacting with the API: GET, POST, PUT and DELETE. For example, the following table shows how a user can interact with resources that follow the **Item** abstraction:

| Path | POST | GET | PUT | DELETE |
| :--- | ---: | ---: | ---: | ---: |
| /resources/items | Sends a POST request to create a new resource | Sends a GET request to read a list of resources | Sends a PUT request to bulk update a list of resources | Sends a DELETE request to bulk delete a list of resources |
| /resources/items/id | Nothing | Sends a GET request to read theresource that matches the given id | Sends a PUT request to update the resource that matches the given id | Sends a DELETE request to delete the resource that matches the given id |

## **Querying**

An HTTP request URL is capable of providing a request query that can be used for querying through the resources. For example, a URL for querying through resources that follow the **Item** abstraction may look like this:  
- `https://api.amrelshafei.com/resources/items?type=Book&price=lt:10`

Here the request URL has the endpoint `/resources/items` and the query string that's preceded with a `?` symbol and has an `&` symbol seperator between each query string parameter `{query_element_key}={query_element_value}`.

In contrast, an HTTP request URL that looks like this `https://api.amrelshafei.com/resources/{abstraction_name}?{query_element_key1}={query_element_value1}&{query_element_key2}={query_element_value2}&...&{query_element_keyN}={query_element_valueN}` will have its query string converted to the following query object and stored inside the request object as a property:
```javascript
query: {
  someQueryElementKey1: someQueryElementValue1,
  someQueryElementKey2: someQueryElementValue2, 
  ...,
  someQueryElementKeyN: someQueryElementValueN
}
// The HTTP request query object (req.query) is an object that contains properties mapped from the request URL query string parameters.
```

## **Handling The Query Object**

In order to perform efficient query operations such as sorting, field selecting, paging, and filtering on resources, the API needs to recieve the request query object in a specific structural pattern.

## **Try The Web API**

### ***On my Web API***
for example, from your browser:  
`http://api.amrelshafei.com/resources/screens`  
`http://api.amrelshafei.com/resources/skills`

### ***On local host***

clone the code or just download it:  
`git clone https://github.com/amrelshafei/my-web-api.git`  

Run the project:  
`cd PROJECT_DIR`  
`npm start`  

Run a redis instance as a docker container:  
`docker run -dp 6379:6379 --name redis-instance redis`

Try sending some http requests from your browser (for example):  
`http://localhost:5000/resources/screens`  
`http://localhost:5000/resources/skills`
