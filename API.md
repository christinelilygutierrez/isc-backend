# ISC API

Errors

|Code	|Name|	Description|
|---|---|---|
200 | OK| Everything worked successfully!
201 | Created | When you're creating a new resource , this will be returned uponsuccess.
400 | Bad Request | We could not process the action
403 | Forbidden | We couldn't authenticate you, or you don't have access to that order.

All errors will return a JSON blob in the following format:
```json
{
  "error": true,
  "message": "Human readable message goes here"
}
```

`POST /Upload/Image`

The following url uploads the users profile image. There are restrictions on the file size. If the users image is posted successfully then the following information is returned

```
curl  -X POST 'http://localhost:3001/api/Upload/Image' -F file=@file.jpg -F data='{"employeeID":"1"}'
```
The following result is obtained

```json
{
  "success": true,
  "fileName": "ef8ca2f5-661b-4901-8625.jpg"
}
```
If you are missing the file then the following error is obtained

```json
{
  "error": true,
  "message": "missing file"
}
```
if  you are missing the data or have invalid json the following response is return

```json
{
  "error": true,
  "message": "invalid json"
}
```


`GET /Media/ProfileImage/:id`

The following gets the users profile image. If success it returns profile image in binary format. if there is an error it is return. Common errors include invalid user id which returns the following error
```json
{
  "error" : true,
   "message" : "no such employee"
}
```
and
```json
{
  "error": true,
  "message": "invalid employee id"
}
```

when the parameter is not an integer

`POST /Upload/CSV`

The following url uploads the CSV files of users. Users are then updated and if there are duplicates errors are thrown

`POST /Authenticate`
The endpoint is used for authenticating users. For example
```bash
curl -k -H "Content-Type: application/json" -X POST -d '{"email":"alice@asu.edu", "password": "1234"}'
'http://localhost:3001/api/Authenticate'
```
will return the following token
```json
{
"success":true,
"message":"Enjoy your token!",
"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"
}
```
However when missing the required parameters `email` and `password`. The following error response will be obtained.

```json
{
  "error": true,
  "message": "missing parameters"
}
```
If the user cannot be authenticated then the following is obtained

```json
{
  "success": false,
  "message": "Authentication failed. Wrong username and password."
}
```
if the json submitted is not valid then this response is obtained.

```json
{
  "error": true,
  "message": "invalid json"
}
```

`GET /Authenticate/`
The following http method is not supported on this and like any other methods not supported. The following error would be obtained.

```json
{
  "error": true,
  "message": "method not supported"
}
```


`GET /Verify/`

The following url verify whether the users token is valid. If its not then error is thrown

`GET /ExistsCompany`

`GET /ExistsOffice`

`GET /ExistsSuperadminWithOffice`

`GET /ExistsTemperatureRange`

`POST /AddCompany`

`POST /AddCluster`

`POST /AddDesk`

`POST /AddEmployee`

`POST /AddEmployees`

`POST /AddEmployeeToOffice`

`POST /AddEmployees`

`POST /AddInitialOfficeWithEmployee`

`POST /AddOffice`

`POST /AddOfficeEmployee`

`POST /AddTeammatesToEmployee`

`POST /AddTemperatureRange`

`POST /AddTemperatureRangeToEmployee`

`GET /DeleteCompany/:id`

`GET /DeleteEmployee/:id`

`GET /DeleteOffice/:id`

`GET /DeleteEntireBlackListForEmployee/:id`

`GET /DeleteEntireWhiteListForEmployee/:id`

`GET /DeleteTemperatureRange/:id`

`POST /EditCompany/:id`

`POST /UpdateCoworkers/:id`

`POST /EditEmployee/:id`

`POST /EditEmployeeUpdatedForOffice/:id`

`POST /EditTemperatureRange/:id`

`GET /AllBlacklistEmployees`

`GET /AllCompanies`

`GET /AllCompaniesForAllOffices`
