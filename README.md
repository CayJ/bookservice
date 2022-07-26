# bookservice
 
GET request

base URL - http://127.0.0.1:3000/findbook

include 1-3 query parameters (title, author, genre), such as:

http://127.0.0.1:3000/findbook?title=mockingbird&author=harper


RESPONSE

reponse JSON format for the top result:

{
"title": "",
"authors": ["",""],
"isbn": [{"type":"ISBN_10", "identifier":"123", {"type":"ISBN_13", "identifier":"12345"],
"averageRating: 4.5
}

response format:

title - string
authors - string array
isbn - object array {"type", "identifier"} where type is the ISBN type and identifier is the ISBN number
 