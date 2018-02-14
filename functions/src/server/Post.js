'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Post = new Schema({
    name: String,
    userId: String
});

module.exports = mongoose.model('Post', Post);