//Read my guide here to run my source code
*First please cd my path with cmd "cd c:\your disk\GianDieuKien-99Tech\src"
*Create .env - I will share my .env to you through email for security. Hope I have an opportunity to demo these pet projects for you.
*If have any question for me. Please do not hesitate to ask me via email.

Problem-4: 
cmd "npm run start4"

You can see my result in the terminal, you can check a time different between them, you should input a big number, I am setting it 1000
=================================================================================================================================
Problem-5: 
cmd "npm run start5"

You can CRUD easy with my system, I will list endpoints below including curl api

***********Create-Product******************
POST http://localhost:3000/v1/product

curl --location 'http://localhost:3000/v1/product' \
--header 'Content-Type: application/json' \
--data '{
    "sku": "001",
    "productName": "A1",
    "quantity": 10,
    "createdBy": "user1",
    "updatedBy": "user1"
}'

--------------------------------------------------------------------------------------------------------------------------------
***********Get-Product-Detail******************
GET http://localhost:3000/v1/product?sku=003

curl --location 'http://localhost:3000/v1/product?sku=003'

--------------------------------------------------------------------------------------------------------------------------------
***********Get-Product-List******************
GET http://localhost:3000/v1/products?skus=['003','002']&productName=A&searchTrue=true&page=1&limit=10&fromDate=03-03-2025&toDate=03-03-2025

curl --location --globoff 'http://localhost:3000/v1/products?skus=[%27003%27%2C%27002%27]&productName=A&searchTrue=true&page=1&limit=10&fromDate=03-03-2025&toDate=03-03-2025'

---------------------------------------------------------------------------------------------------------------------------------
***********Update-Product******************
PUT http://localhost:3000/v1/product/:id

curl --location --request PUT 'http://localhost:3000/v1/product/67c427896ec932e397cd43a2' \
--header 'Content-Type: application/json' \
--data '{
    "_v": 3,
    "quantity": 60,
    "updatedBy": "user1"
}'

---------------------------------------------------------------------------------------------------------------------------------
***********Delete-Product******************
DELETE http://localhost:3000/v1/product/:id?_v=4

curl --location --request DELETE 'http://localhost:3000/v1/product/67c427896ec932e397cd43a2?_v=4'

Technology: Nodejs, MongoDB
=================================================================================================================================
Problem-6: 
cmd "npm run start6"

***********Create-User******************
POST http://localhost:3001/v1/user

curl --location 'http://localhost:3001/v1/user' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "user11@gmail.com",
    "password": "user11",
    "fullName": "user11",
    "nickName": "user11",
    "createdBy": "gdk11@gmail.com",
    "updatedBy": "gdk11@gmail.com",
    "role": "user"
}'

---------------------------------------------------------------------------------------------------------------------------------
***********Login******************
POST http://localhost:3001/v1/login

curl --location 'http://localhost:3001/v1/login' \
--header 'Content-Type: application/json' \
--data-raw '



{
    "email": "user1@gmail.com",
    "password": "user1"
}'

---------------------------------------------------------------------------------------------------------------------------------
***********Update-Config******************
PUT http://localhost:3001/v1/config/:id

curl --location --request PUT 'http://localhost:3001/v1/config/67c59006314598d129be6464' \
--header 'Content-Type: application/json' \
--header 'Authorization: ••••••' \
--data '{
    "isAddScoreEnabled": false,
    "_v": 8
}'

---------------------------------------------------------------------------------------------------------------------------------
***********Add-Score******************
PUT http://localhost:3001/v1/user/:id/add-score

curl --location --request PUT 'http://localhost:3001/v1/user/67c584a4a1015cb46369596f/add-score' \
--header 'Content-Type: application/json' \
--header 'Authorization: ••••••' \
--data '{
    "score": 50,
    "nickName": "user10",
    "createdBy": "user10",
    "updatedBy": "user10",
    "_v": 7
}'

---------------------------------------------------------------------------------------------------------------------------------
***********Get-Top-Ten-Score******************
GET http://localhost:3001/v1/user/top-ten

curl --location 'http://localhost:3001/v1/user/top-ten' \
--header 'Authorization: ••••••'

---------------------------------------------------------------------------------------------------------------------------------
***********Update-All-Scores******************
PUT http://localhost:3001/v1/user/update-all-scores

curl --location --request PUT 'http://localhost:3001/v1/user/update-all-scores' \
--header 'Content-Type: application/json' \
--header 'Authorization: ••••••' \
--data '[
    {
        "userId": "67c584a9a1015cb463695974",
        "score": 90,
        "nickName": "user11",
        "createdBy": "user11",
        "updatedBy": "user11",
        "_v": 0
    },
    {
        "userId": "67c584a4a1015cb46369596f",
        "score": 98,
        "nickName": "user10",
        "createdBy": "user10",
        "updatedBy": "user10",
        "_v": 0
    }
]'

---------------------------------------------------------------------------------------------------------------------------------
***********Create-Config******************
POST http://localhost:3001/v1/config

curl --location 'http://localhost:3001/v1/config' \
--header 'Content-Type: application/json' \
--header 'Authorization: ••••••' \
--data '{
    "isAddScoreEnabled": true,
    "createdBy": "user1",
    "updatedBy": "user1"
}'

Technology: Nodejs, MongoDB, Redis, Bcrypt Password, JWT, Docker to run Redis local ...
