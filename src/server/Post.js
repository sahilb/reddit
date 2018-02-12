var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema({
    id: String,
    num_comments: Number,
    title: String,
    url :String,
    permalink: String,
    thumbnail: String,
    thumbnail_height: Number, 
    thumbnail_width: Number, 
    previewUrl: String, 
    previewType: String,
    isFavorite: Boolean
});

module.exports = mongoose.model('Post', Post);
 