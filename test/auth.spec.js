var app = require('../app');
var chai = require('chai');
var request = require('supertest');
var path = require('path');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/database');

var Photo = require('../models/PhotoModel').Photo;
var Marker = require('../models/MarkerModel');
var User = require('../models/UserModel');
var PhotoController = require('../controller/photo');
var MarkerController = require('../controller/marker');

var bcrypt = require('bcrypt-nodejs');
var expect = chai.expect;

describe('passport auth test', () => {
  describe('signup', () => {
    afterEach(function(done){
      User.remove({}, function(err, result){
        if(err) return console.log(err);
        done();
      });
    });

    it('sign up new user', (done) => {
      const username = 'one';
      const email = 'one@gmail.com';
      const password = 'password';
      request(app).post('/auth/signup')
        .send({
          username: username,
          email: email,
          password: password
        })
        .end((err, res) => {
          //expect(res.statusCode).to.equal(200);
          User.findOne({ "username": username }, function(err, user){
            expect(user.username).to.equal(username);
            expect(bcrypt.compareSync(password, user.password)).to.equal(true);
            expect(user.email).to.equal(email);
            done();
          });
        });
    });
  });

  describe('login', () => {
    describe('when a user is registered', () => {
      const username = 'other one',
            email = 'other@gmail.com',
            pw = bcrypt.hashSync('password', bcrypt.genSaltSync(10), null);

      beforeEach(function(done){
        let user = new User();
        user.username = username;
        user.email = email;
        user.password = pw;
        user.save(function(err, result){
          if(err) return console.log(err);
          done();
        });
      });
      it('login with right user info', (done) => {
        request(app).post('/auth/login')
          .send({username: username, email: email, password: 'password'})
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            //expect(res.username).to.exist();
            done();
          });
      });
      it('login with wrong username', (done) => {
        request(app).post('/auth/login')
          .send({username: 'bogus', email: email, password: 'password'})
          .end((err, res) => {
            expect(res.statusCode).to.equal(401);
            //expect(res.username).to.exist();
            //console.log(res.statusCode)
            done();
          });
      });
      it('login with wrong password', () => {
        request(app).post('/auth/login')
          .send({username: username, email: email, password: 'passwor'})
          .end((err, res) => {
            expect(res.statusCode).to.equal(401);
            //expect(res.username).to.exist();
            done();
          });
      })
    })
  })
})
