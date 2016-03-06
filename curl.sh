curl -k 'http://localhost:3001/api/Authenticate'
{"error": true ,"message":"acess denied"}

curl -k -H "Content-Type: application/json" -X POST -d '{"accountName":"test","value":"hello"}'
'http://localhost:3001/api/Authenticate'
{"error": true ,"message":"missing parameters"}

curl -k -H "Content-Type: application/json" -X POST -d '{' 'http://localhost:3001/api/Authenticate'
{"error": true ,"message":"missing parameters"}

curl -k -H "Content-Type: application/json" -X POST -d '{' 'http://localhost:3001/api/Authenticate'
{"error":true,"message":"invalid json"}

curl -k -H "Content-Type: application/json" -X POST -d '{"email":"alice@asu.edu", "password": "1234"}'
'http://localhost:3001/api/Authenticate'
{
"success":true,
"message":"Enjoy your token!","token":
"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
}

curl -k -H "Content-Type: application/json" -X POST -d '{"email":"alice@asu.edu", "password": "123"}'
'http://localhost:3001/api/Authenticate'
{"success":false,"message":"Authentication failed. Wrong username and password."}

curl  -X POST 'http://localhost:3001/api/Upload/Image' -F file=@file.jpg -F data='{"employeeID":"1"}'
{"success": true ,"fileName":"ef8ca2f5-661b-4901-8625.jpg"}

curl  -X POST 'http://localhost:3001/api/Upload/Image' -F file=@file.jpg -F data='{"employeeID":"1"'
{"error":true,"message":"invalid json"}

curl  -X POST 'http://localhost:3001/api/Upload/Image' -F data='{"employeeID":"1"}'
{"error":true,"message":"missing file"}

curl -k 'http://localhost:3001/api/Verify?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
[{"employeeID":1,"firstName":"Alice","lastName":"Smith","email":"alice@asu.edu","password":"$2a$10$pHZ/rsnywVRaDeG1D2ZVSumk9nwYPhneZ1kGcmRLU9GNwTIoB.aHa","department":"health","title":"physician","restroomUsage":0,"noisePreference":0,"outOfDesk":0,"pictureAddress":"alice.jpg","permissionLevel":"superadmin"}]


curl -k 'http://localhost:3001/api/Verify?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
{"success":false,"message":"Failed to authenticate token."}

curl -k 'http://localhost:3001/api/Verify?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9'
{"success":false,"message":"Token has expired"}


# expires n seconds

curl -k -H "Content-Type: application/json" -X POST -d '{"email":"alice@asu.edu", "password": "1234"}' http://localhost:3001/api/Authenticate
{"success":true,"message":"Enjoy your token!","token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFsaWNlQGFzdS5lZHUiLCJwYXNzd29yZCI6IiQyYSQxMCRwSFovcnNueXdWUmFEZUcxRDJaVlN1bWs5bndZUGhuZVoxa0djbVJMVTlHTndUSW9CLmFIYSIsImlhdCI6MTQ1NzIzMjg0NCwiZXhwIjoxNDU3MjMyODQ5fQ.m3AOzudSeyjqQipkqVgdQN4yEoSSExmwPkvII2207V0"}
