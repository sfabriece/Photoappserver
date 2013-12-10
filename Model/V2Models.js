var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var pictureSchema = new Schema({
	version: {type: String, default: 'v2'},
	thumburl: String,
	url: String,
	tag: {type: String, default: "undefined"},
	date: Date,
	idf: {type: Number, default: 0}
});

var tagSchema = new Schema({
	version: {type: String, default: 'v2'},
	name: String
});

exports.Picture = mongoose.model('Picturev2', pictureSchema, 'picturev2');
exports.Tag = mongoose.model('Tag', tagSchema, 'tag');