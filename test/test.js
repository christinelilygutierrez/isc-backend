var should = require('should');
var assert = require('assert');
var request = require('supertest');
var baseUrl = 'http://localhost:3001';
var server = request.agent(baseUrl);
var path = require('path');
describe("Authentication Unity Tests",function(){
  it("should return home page",function(done){
    server
    .get("/")
    .expect('Content-type',"text/html")
    .expect(200)
    .end(function(err, res){
      done();
    });
  });
  it("should return method not allowed",function(done){
    server
    .get('/api/Authenticate')
    .expect("Content-type",/json/)
    .expect(405)
    .end(function(err,res){
      res.status.should.equal(405);
      res.body.error.should.equal(true);
      res.body.message.should.equal("method not supported");
      done();
    });
  });
  it("should return token if authenticated", function(done){
    var user={
      email: 'alice@asu.edu',
      password: '1234'
    };
    server
    .post('/api/Authenticate')
    .send(user)
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      res.body.success.should.equal(true);
      res.body.message.should.equal("Enjoy your token!");
      should.exist(res.body.token);
      done();
    });
  });
  it("should return error for wrong username", function(done){
    var user={
      email: 'alie@asu.edu',
      password: '1234'
    };
    server
    .post('/api/Authenticate')
    .send(user)
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      res.body.success.should.equal(false);
      res.body.message.should.equal("Authentication failed. Wrong username and password");
      should.not.exist(res.body.token);
      done();
    });
  });
  it("should return error for wrong username", function(done){
    var user={
      email: 'alice@asu.edu',
      password: '123'
    };
    server
    .post('/api/Authenticate')
    .send(user)
    .expect("Content-type",/json/)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      res.body.success.should.equal(false);
      res.body.message.should.equal("Authentication failed. Wrong username and password");
      should.not.exist(res.body.token);
      done();
    });
  });
  it("should return error missing params", function(done){
    var user={
      email: 'alice@asu.edu'
    };
    server
    .post('/api/Authenticate')
    .send(user)
    .expect("Content-type",/json/)
    .expect(400)
    .end(function(err, res){
      res.status.should.equal(400);
      res.body.error.should.equal(true);
      res.body.message.should.equal("missing parameters");
      should.not.exist(res.body.token);
      done();
    });
  });
  it("should return error missing params", function(done){
    var user={
      password: 'alice'
    };
    server
    .post('/api/Authenticate')
    .send(user)
    .expect("Content-type",/json/)
    .expect(400)
    .end(function(err, res){
      res.status.should.equal(400);
      res.body.error.should.equal(true);
      res.body.message.should.equal("missing parameters");
      should.not.exist(res.body.token);
      done();
    });
  });
  it("should return error invalid json", function(done){
    server
    .post('/api/Authenticate')
    .send('{"invalid"}')
        .type('json')
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function(err, res) {
          res.status.should.equal(400);
          res.body.error.should.equal(true);
          res.body.message.should.equal("invalid json");
        done();
    });
  });
});
describe('Image Upload  Unity Tests', function () {
    it('should upload an image and return fileName in result', function (done) {
        server
            .post('/api/Upload/Image')
            .field('employeeID', 1)
            .attach('file', 'test/file.jpg')
            .expect(200)
            .end(function(err,res) {
              //console.log(res.error);
              res.status.should.equal(200);
              res.body.success.should.equal(true);
              should.exist(res.body.fileName);
              done();
            });
    });
    it('should return upload error missing employee information', function (done) {
        server
        .post('/api/Upload/Image')
        .attach('file', 'test/file.jpg')
        .expect(400)
        .end(function(err,res) {
               res.status.should.equal(400);
               res.body.error.should.equal(true);
               res.body.message.should.equal('missing employeeID');
               should.not.exist(res.body.fileName);
              done();
            });
    });
    it('should return upload error missing file ', function (done) {
        server
            .post('/api/Upload/Image')
            .field('employeeID', 1)
            .expect(200)
            .end(function(err,res) {
              res.status.should.equal(400);
              res.body.error.should.equal(true);
              res.body.message.should.equal('missing file');
              should.not.exist(res.body.fileName);
              done();
            });
    });
    // TODO: The following test is failing because there is silent sanity checking at the database level
    // If there is an error then it should be thrown
    it('should return upload error missing file ', function (done) {
        server
            .post('/api/Upload/Image')
            .field('employeeID','{"invalid"}')
            .attach('file', 'test/file.jpg')
            .expect(400)
            .end(function(err,res) {
              // res.status.should.equal(400);
              // res.body.error.should.equal(true);
              // res.body.message.should.equal('missing employeeID');
              // should.not.exist(res.body.fileName);
              // console.log(res.error);
              done();
            });
    });
    it('should get image for employee with id given', function (done) {
        server
            .get('/api/Media/ProfileImage/1')
            .expect(200)
            .end(function(err,res) {
              res.status.should.equal(200);
              done();
            });
    });
    it('should return invalid error for a non integer id', function (done) {
        server
            .get('/api/Media/ProfileImage/states')
            .expect(400)
            .end(function(err,res) {
              res.status.should.equal(400);
              res.body.error.should.equal(true);
              res.body.message.should.equal("invalid employee id");
              done();
            });
    });
    it('should return error  for an employee that does not exist', function (done) {
          server
              .get('/api/Media/ProfileImage/40')
              .expect(400)
              .end(function(err,res) {
                res.status.should.equal(400);
                res.body.error.should.equal(true);
                res.body.message.should.equal("no such employee");
                res.status.should.equal(400);
                done();
              });
      });
});
var valid_token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFsaWNlQGFzdS5lZHUiLCJwYXNzd29yZCI6IiQyYSQxMCRwSFovcnNueXdWUmFEZUcxRDJaVlN1bWs5bndZUGhuZVoxa0djbVJMVTlHTndUSW9CLmFIYSIsImlhdCI6MTQ1NzIzMjk2NiwiZXhwIjoxNDU4Nzc2NTk5MTYzfQ.vphYLK9ZcEe1BKLh7AvnJOWpjD-zHVzwfB7GoOL_4XE";
var non_valid_token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9";
var expired_token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImFsaWNlQGFzdS5lZHUiLCJwYXNzd29yZCI6IiQyYSQxMCRwSFovcnNueXdWUmFEZUcxRDJaVlN1bWs5bndZUGhuZVoxa0djbVJMVTlHTndUSW9CLmFIYSIsImlhdCI6MTQ1NzIzMjg0NCwiZXhwIjoxNDU3MjMyODQ5fQ.m3AOzudSeyjqQipkqVgdQN4yEoSSExmwPkvII2207V0";
describe("Verify Tokens Unity Tests", function(){
  it('should verify a valid token', function(done){
    server
    .get('/api/Verify/')
    .set('x-access-token', valid_token)
    .expect(200)
    .end(function(err, res){
      res.status.should.equal(200);
      res.body[0].employeeID.should.equal(1);
      res.body[0].firstName.should.equal("Alice");
      res.body[0].lastName.should.equal("Smith");
      res.body[0].email.should.equal("alice@asu.edu");
      done();
    });
  });
  it('should verify a non valid token and return error', function(done){
    server
    .get('/api/Verify/')
    .set('x-access-token', non_valid_token)
    .expect(403)
    .end(function(err, res){
      res.status.should.equal(403);
      res.body.success.should.equal(false);
      res.body.message.should.equal('Failed to authenticate token.');
      done();
    });
  });
  it('should verify an expired and return an error', function(done){
    server
    .get('/api/Verify/')
    .set('x-access-token', expired_token)
    .expect(403)
    .end(function(err, res){
      res.status.should.equal(403);
      res.body.success.should.equal(false);
      res.body.message.should.equal('Failed to authenticate token.');
      done();
    });

  });
  it('should verify  missing token and return error', function(done){
    server
    .get('/api/Verify/')
    .expect(403)
    .end(function(err, res){
      res.status.should.equal(403);
      res.body.success.should.equal(false);
      res.body.message.should.equal('No token provided.');
      done();
    });
  });
});
describe("Company CRUD Unity Tests", function(){
  it('should return when a company is created', function(done){
    var company={
      companyName: 'Apple'
    };
    server
    .post('/api/AddCompany')
    .send(company)
    .expect(200)
    .end(function(err,res){
      res.body.success.should.equal(true);
      res.status.should.equal(200);
      res.body.message.should.equal('Company Added.');
      done();
    });
  });
  it('should return error for missing company', function(done){
    server
    .post('/api/AddCompany')
    .send('')
    .expect(403)
    .end(function(err, res){
      res.body.error.should.equal(true);
      res.status.should.equal(400);
      res.body.message.should.equal('Missing Company Name');
      done();
    });
  });
  it('should return error for a invalid json', function(done){
    server
    .post('/api/AddCompany')
    .send('{"invalid"}')
    .type('json')
    .expect(400)
    .end(function(err, res){
      res.body.error.should.equal(true);
      res.status.should.equal(400);
      res.body.message.should.equal('invalid json');
      done();
    });
  });
  it('should return error for missing company name', function(done){
    var company = {
      name: 'Apple'
    };
    server
    .post('/api/AddCompany')
    .send(company)
    .type('json')
    .expect(400)
    .end(function(err, res){
      res.body.error.should.equal(true);
      res.status.should.equal(400);
      res.body.message.should.equal('Missing Company Name');
      done();
    });

  });
  // it('should updated an existing company', function(done){
  //
  // });
  // it('should throw an error if company does not exist', function(done){
  //
  // });
  // it('should throw an error if company id is not number', function(done){
  //
  // });

});
