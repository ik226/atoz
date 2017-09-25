var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Photo = require('./PhotoModel');

var photoSchema = Photo.photoSchema;

var markerSchema = new Schema({
    position: {lat: Number, lng: Number},
    defaultAnimation: Number,
    id: String,
    //showInfo: Boolean,
    //infoContent: null, //deal with infocontent at client side
    //photos: [String], //only handles String(photo id)
    photos: [photoSchema],
    display: Boolean

});

var Marker = mongoose.model('Marker', markerSchema);

module.exports = Marker;
