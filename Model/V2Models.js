var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var pictureSchema = new Schema({
	version: {type: String, default: 'v2'},
	thumburl: String,
	url: String,
	tag: [String],
	date: Date 
});

var tagSchema = new Schema({
	version: {type: String, default: 'v2'},
	name: String
});

exports.Picture = mongoose.model('Picturev2', pictureSchema, 'picturev2');
exports.Tag = mongoose.model('Tag', tagSchema, 'tag');