Endpoint: req.body  
POST: localhost:8000/api/v1/createUser --- req.body= {"name":"Test User "}  
GET: localhost:8000/api/v1/   
GET: localhost:8000/api/v1/stats/getStats --- req.body = {monthString: "2/2024"}  
GET: localhost:8000/api/v1/:userId  
PATCH: localhost:8000/api/v1/in/:userId --- req.body = {"inTime": "2024-02-23T05:30"}  
PATCH: localhost:8000/api/v1/out/:userId --- req.body = {"inTime": "2024-02-23T08:30"}  


Create a user  
Use the _id generated for furthur requests.
