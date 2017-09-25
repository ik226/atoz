var Marker = require('../models/MarkerModel');

module.exports.findWithId = function(markerId, callback){
  Marker.findOne({ "id": markerId }, function(err, marker){
    callback(err, marker)
  });
};

module.exports.findWithIdAndUpdatePhoto = function(markerId, photoObj, callback){
  Marker.update({ "id": markerId }, { $push: {"photos": photoObj} }, function(err, result){
    callback(err, result);
  });
};

module.exports.findWithIdAndRemoveOnePhoto = function(markerId, photoId, callback){
  Marker.update({ "id": markerId }, { $pull: { "photos": { "_id": photoId } } },
    {safe: true},
    function(err, result){
      callback(err, result);
    });
};

module.exports.saveMarker = function(markerId, position, animation, photos, display, callback){
  var marker = new Marker();
  marker.position = position;
  marker.id = markerId;
  marker.defaultAnimation = animation;
  marker.photos = photos;
  marker.display = display;

  marker.save(function(err, result){
    callback(err, result);
  })
}
