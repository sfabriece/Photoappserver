/*Instagram = require('instagram-node-lib');

Instagram.set('client_id', '34fa91a54ccf404788dbc342ebd8cbf7');
Instagram.set('client_secret', 'e6cb560183854e7c887f1bfbc0a1d8fb');

Instagram.tags.recent({
	name: 'jojoemil',
	complete: function(data) {
		console.log(data);
	}
});*/
var async = require('async');
//var Instagram = require('instagram-node-lib');
var Tags = require('./tags');
var ig = require('instagram-node').instagram();

ig.use({
	client_id: '34fa91a54ccf404788dbc342ebd8cbf7',
	client_secret: 'e6cb560183854e7c887f1bfbc0a1d8fb'
});

/*Instagram.set('client_id', '34fa91a54ccf404788dbc342ebd8cbf7');
Instagram.set('client_secret', 'e6cb560183854e7c887f1bfbc0a1d8fb');*/
var internals = {};
module.exports = internals.Insta = function(options) {
	this.db = options.db;
};

internals.Insta.prototype.start = function(callback) {
	return callback()
};

internals.Insta.prototype.search = function(callback) {
	//console.log(typeof this.getNewTagInsta);
	var self = this;
	async.waterfall([
		function loadTags(lfCallback) {
			Tags.load(self.db, lfCallback); //returns tags
		},
		function getNewTags(tags, gntCallback) {
			async.concat(tags, self.getNewTagInsta, gntCallback);
		},
    	function viewResults(results, vrCallback) {
			console.log(JSON.stringify(results));
			vrCallback(null, 'done');
    	}
	], function(err, result) {
		console.log("err: " + err);
		console.log("result: " + result);
		return callback(err, result);
	});
};

internals.Insta.prototype.getNewTagInsta = function(tag, callback) {
	console.log("processing tag: " + JSON.stringify(tag));
	ig.tag_media_recent(tag.name, {
			min_tag_id: tag.min_id,
		},
		function(err, medias, pagination, remaining, limit) {
			console.log("pagi: " + JSON.stringify(pagination));
			console.log("remaining: " + remaining);
			console.log("limit: " + limit);
			return callback(null, medias);
		});
	/*Instagram.tags.recent({
		name: tag.name,
		min_tag_id: tag.min_id,
		complete: function(data) {
			callback(null, data);
		}
	});*/
};
/*Instagram.tags.info({
	name: 'blue',
	complete: function(data) {
		console.log(data);
	}
});*/