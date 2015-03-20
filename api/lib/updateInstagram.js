var async = require('async');
var mysql = require('mysql');
var Pictures = require('./pictures');
var Tags = require('./tags');
var ig = require('instagram-node').instagram();
var CronJob = require('cron').CronJob;

var internals = {};
var db;
module.exports = internals.Insta = function(options) {
	this.db = options.db;
	db = this.db;
	ig.use({
		client_id: options.vault.client_id /*'34fa91a54ccf404788dbc342ebd8cbf7'*/ ,
		client_secret: options.vault.client_secret /*'e6cb560183854e7c887f1bfbc0a1d8fb'*/
	});
};

internals.Insta.prototype.start = function(callback) {
	var self = this;
	new CronJob("*/30 * * * * * ", function() {
		self.search();
	}, null, true, "Europe/Oslo");
	return callback()
};

internals.Insta.prototype.search = function() {
	//console.log(typeof this.getNewTagInsta);
	var self = this;
	async.waterfall([
		function loadTags(lfCallback) {
			Tags.load(self.db, lfCallback); //returns tags
		},
		function getNewPics(tags, gnpCallback) {
			async.concat(tags.slice(0, 20), self.getNewPicInsta, gnpCallback); //TODO first 20 tags for now
		},
		function saveNewPics(pics, snpCallback) {
			async.concat(pics, self.savePicsToDb, snpCallback);
		}
	], function(err, result) {
		if (err) {
			console.log("Insta search error: " + err);
		};
		//console.log("err: " + err);
		//console.log("result: " + result);
		//return callback(err, result);
	});
};

//Updates a tag min_id and saves pictures under the tag
internals.Insta.prototype.savePicsToDb = function(pic, callback) {
	var qry = "UPDATE tag SET min_id=" + pic.tag.min_id + " WHERE name = " + mysql.escape(pic.tag.name);
	async.waterfall([function updateTag(utCallback) {
		db.sql(qry, function(err) { //TODO put functionality in tags.js
			if (err) {
				console.log("error updating tag: " + err);
				return utCallback(err);
			};
			return utCallback();
		});
	}, function savePictures(snpCallback) {
		Pictures.saveMany(db, pic.medias, function(err) {
			if (err) {
				console.log("error saving pics: " + err);
				return snpCallback(err);
			};
			return snpCallback();
		});
	}], function(err, result) {
		return callback(err, result);
	});
};

internals.Insta.prototype.getNewPicInsta = function(tag, callback) {
	ig.tag_media_recent(tag.name, {
			min_tag_id: tag.min_id,
		},
		function(err, medias, pagination, remaining, limit) {
			if (err) {
				return callback(err);
			};
			//console.log("pagi: " + JSON.stringify(pagination));
			console.log("remaining: " + remaining);
			//console.log("limit: " + limit);

			if (!pagination.min_tag_id) {
				return callback(null, null);
			}
			tag.min_id = pagination.min_tag_id;
			var results = {};
			results.tag = tag;
			results.medias = [];
			for (var i = medias.length - 1; i >= 0; i--) {
				var pic = medias[i];
				results.medias.push({
					date: pic.created_time,
					url: pic.images.standard_resolution.url,
					thumbUrl: pic.images.thumbnail.url,
					tag: tag.name
				});
			};
			return callback(null, results);
		});
};