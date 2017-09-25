var app = require('../app');
var chai = require('chai');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/database');

var Photo = require('../models/PhotoModel').Photo;
var Marker = require('../models/MarkerModel');
var PhotoController = require('../controller/photo');
var MarkerController = require('../controller/marker');

var expect = chai.expect;

describe('model consistency when controller applied', () => {
  describe('delete', () => {
    var mId="1";
    var pId="1";
    var path="/some";
    var position = {lat:1, lng:1};
    var savedMarkerDoc;
    var savedPicDoc;
    var _pId;

    beforeEach(function(done){
      MarkerController.saveMarker(mId, position, 1, [], true, function(err, doc){
        if(err) return console.log(err);
        savedMarkerDoc = doc;
        PhotoController.savePhoto(pId, mId, path, null, function(err, doc){
          savedPicDoc = doc;
          _pId = doc._id;
          if(err) return console.log(err);
          MarkerController.findWithIdAndUpdatePhoto(mId, doc, function(err, result){
            if(err) return console.log(err);

            done();
          });
        });
      });
    });
    afterEach(function(done){

      Marker.remove({}, function(err, result){
        if(err) console.log(err);
        Photo.remove({}, function(err, reesult){
          if(err) console.log(err);
          done();
        })
      });


    });

    it('check whether photo saved successfully in beforeEach hook', (done) => {
      MarkerController.findWithId(mId, function(err, marker){
        expect(marker.photos).to.have.lengthOf(1);
        expect(marker.photos[0].id).to.equal(pId);
        done();
      });
    });

    it('delete a photo from marker', (done) => {
      MarkerController.findWithId(mId, function(err, m){
        expect(m.photos).to.have.lengthOf(1);
        MarkerController.findWithIdAndRemoveOnePhoto(mId, _pId, function(err, result){
          MarkerController.findWithId(mId, function(err, marker){
            expect(marker.photos).to.have.lengthOf(0);
            console.log(marker.photos)
            done();
          });
        });
      });
    });

  });

});
