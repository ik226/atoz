var app = require('../app');
var chai = require('chai');
var request = require('supertest');
var path = require('path');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/database');

var Photo = require('../models/PhotoModel').Photo;
var Marker = require('../models/MarkerModel');
var PhotoController = require('../controller/photo');
var MarkerController = require('../controller/marker');

var expect = chai.expect;

describe('AtoZ API integration test', () => {

  describe('#GET /markers api', () => {
    it('should get all markers', (done) => {
      request(app).get('/api/markers').end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.be.an('Object');
        done();
      });
    });
  });

  describe('/images api', () => {
    /*
    describe('#POST /image', () => {
      afterEach(function(done){
        Photo.remove({}, function(){ done(); })
      })
      it('should post this file', (done) => {
        var pId = '1';
        var mId = '2';
        request(app).post('/api/images')
          .field('photoId', pId)
          .field('markerId', mId)
          .attach('imageFile', __dirname + '/goodone.jpg')
          .end((err, res) => {
            expect(res.statusCode).to.equal(200);
            PhotoController.findWithId('1', function(err, doc){
              expect(doc).to.exist;
              expect(doc.markerId).to.equal('2');
              done();
            })

          });
      });
    });
    */
    describe('#DELETE /image', () => {
      var mId="1";
      var pId="1";
      var path="/some";
      var position = {lat:1, lng:1};
      var currentDoc;

      beforeEach(function(done){
        MarkerController.saveMarker(mId, position, 1, [], true, function(err, doc){
          if(err) return console.log(err);
          PhotoController.savePhoto(pId, mId, path, null, function(err, doc){
            if(err) return console.log(err);
            MarkerController.findWithIdAndUpdatePhoto(mId, doc, function(err, result){
              if(err) return console.log(err);
              currentDoc = doc;
              done();
            });
          });
        });
      });

      afterEach(function(done){
        Photo.remove({}, function(){
          Marker.remove({}, function(){ done(); });
       });

      });

      it('should remove marker doc and photo doc', (done) => {
        request(app).del('/api/images')
          .send({id: '1'})
          .end((err, res) => {

            expect(res.statusCode).to.equal(200);
            PhotoController.findWithId('1', function(doc){
              //console.log('should be empty: ', doc);
              expect(doc).to.not.exist;
              expect(doc).to.not.equal(currentDoc);
              done();
            });
          });
      });
    });
  });



});
