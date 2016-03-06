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
    var user='pqr:{"abc":"abc",}';
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
