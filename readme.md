# Apollo gateway tracing

Tracing information not being returned by apollo gateway.

To run `npm start`

The example will expose two endpoints:

- graphql: [POST,GET] http://localhost:7071/api/graphql
- bookService: [POST,GET] http://localhost:7071/api/bookService


If we visit the gateway grapqhl endpoint, tracing information is not returned

If we go straight to the bookService graphql endpoint, tracing information is returned

Example query 
```
{
  books {
    title
  }
}
```