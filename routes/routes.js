var express = require('express');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var async = require('async');

var router = express.Router();
var Marker = require('../models/MarkerModel.js');
var Photo = require('../models/PhotoModel.js').Photo;
var PhotoController = require('../controller/photo');
var MarkerController = require('../controller/marker');



//get markers from DB
//TODO: get all the photos and send as response
//      might require async waterfall
router.get('/markers', function(req, res){
  async.waterfall([
    //get marker data from db
    function(callback){
      var result={};
      Marker.find((err, markers) => {
        if(err){
          callback(err)
        } else {
          result.markers = markers//.toJSON()

          callback(null, result)
        }

      })
    },
    //get photo data from db
    function(result, callback){
      Photo.find((err, photos) => {
        if(err){
          callback(err)
        } else {
          result.photos = photos//.toJSON()

          callback(null, result);
        }
      })
    }
  ], function(err, result){
    if(err){
      res.status(500).send({message: 'error from GET initial data'})
    }

    res.status(200).json(result);
  });
});

//post markers to DB so that creates new marker
router.post('/markers', isAuthenticated(), function(req, res){

  var position = req.body.position,
      id = req.body.id,
      animation = req.body.defaultAnimation ? req.body.defaultAnimation : 3,
      photos = [],
      display = true;

  MarkerController.saveMarker(id, position, animation, photos, display,
    function(err, result){
      if(err) {
        res.status(500).send(err);
      }
      res.status(200).send('new marker created successfully');
    }
  );

});

//delete specific marker
//TODO: remove photo docs corresponding to those inside deleted marker
router.delete('/markers', function(req, res){

  var markerId = req.body.id;

  async.waterfall([
    function(callback){
      Marker.findOne({"id": markerId}).remove(function(err, result){
        if(err){
          callback(err)
        }
        callback(null, result)
      })
    },
    function(result, callback){
      Photo.find({"markerId": markerId}).remove(function(err, result){
        if(err){
          callback(err)
        }
        callback(null, result)
      })
    }
  ], function(err, result){
    if(err){
      res.status(500).send(err);
    }
    res.status(200).json({message: markerId + ' is removed'});
  });

});

/*
  photo handling routes
*/

//=============== utils ===============//
//TODO: should be inside separate module
function removeFiles(filePath, callback){
  fs.unlink(filepath, callback(err))
}
//=====================================//
//update photos to marker
router.post('/images', function(req, res){

  var imageDir = path.join(__dirname, '../temp_image_dir');

  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = imageDir;

  var markerId;
  var photoIds;

  form.parse(req, function(err, fields, files){
    if(err){
      console.log(err)
    }

    if(fields.markerId){
      markerId = fields.markerId;
      photoIds = fields.photoId.split(',');

    }

  })
  //rename photo name inside the directory to be its photoId
  //TODO: decide how to handle directories
  form.on('file', function(field, file){
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });

  form.on('error', function(err){
    //console.log(err);
    res.status(500).send({error: 'error on formidable process'});
  })
    //save new photo
  form.on('end', function(){

    //store to mongo
    async.each(photoIds, function(photoId, callback){

      //callback to be called after saving each photo docs
      var cb = function(err, result){
        //console.log(err, result, markerId)
        if(err) return callback(err);
        MarkerController.findWithIdAndUpdatePhoto(markerId, result,
          function(err, result){
            if(err) return callback(err);
            callback(null);
          }
        );
      };

      PhotoController.savePhoto(
        photoId,
        markerId,
        path.join(form.uploadDir, photoId),
        null,
        cb
      )

    }, function(err){
      if(err){
        res.status(500).send({message: 'error from saving photo'});
      } else {
        res.status(200).send({message: 'successfully saved photos'})
      }
    });

  });

});

//delete photo
router.delete('/images', function(req, res){

  var photoId = req.body.id;

  async.waterfall([
    function(callback){

      PhotoController.removePhotoById(photoId, function(err, doc){
        if(err) return callback(err);
        callback(null, doc.markerId, doc._id);
      });

    },
    function(markerId, photoId, callback){

      MarkerController.findWithIdAndRemoveOnePhoto(markerId, photoId, function(err, result){
        if(err) return callback(err);
        callback(null, result);
      })
    }
  ], function(err, result){
    if(err){
      console.log(err)
      res.status(500).send(err);
    }

    res.status(200).send('photo is removed');
  });
});

router.get('/images', function(req, res){
  var photoId = req.body.id;
  Photo.find({})
    .exec()
    .then(photo => { res.status(200).json(photo) })
    .catch(err => { res.status(500).send(err); });
})

function isAuthenticated(){ return function(req, res, next){
  if(req.isAuthenticated()) return next();
  console.log(req.isAuthenticated())}
}

module.exports = router;
