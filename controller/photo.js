var Photo = require('../models/PhotoModel.js').Photo;

module.exports.savePhoto = function(photoId, markerId, path, uploader='administrative', callback){
  var newPhoto = new Photo();
  newPhoto.id = photoId;
  newPhoto.markerId = markerId;
  newPhoto.filename = photoId;
  newPhoto.path = path;
  newPhoto.uploader = uploader;

  newPhoto.save(function(err, result){
    callback(err, result);
  });
};

//return the photo doc that just removed
module.exports.removePhotoById = function(photoId, callback){
  Photo.findOne({'id': photoId}, function(err, doc){
    doc.remove(function(err, result){
      callback(err, doc);
    });
  });
}

module.exports.findWithId = function(photoId, callback){
  Photo.findOne({"id": photoId}, function(err, result){
    callback(err, result);
  })
}
