var mongoose = require('mongoose');
//var Schema = mongoose.Schema;

var photoSchema = mongoose.Schema({
    id: String,
    path: String,
    filename: String,
    markerId: String,
    uploader: String
});


var Photo = mongoose.model('Photo', photoSchema);


module.exports = {Photo: Photo, photoSchema: photoSchema};
