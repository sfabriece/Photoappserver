var Joi = require('joi');
var mysql = require('mysql');
exports.get = {
	handler: function(request, reply) {
		exports.load(this.db, function(err, tags) {
			if (err) {
				console.log(err);
				return reply(err);
			}

			return reply(tags);
		});
	}
};

exports.post = {
	validate: {
		payload: Joi.array().items(Joi.object().keys({
			"name": Joi.string().required()
		}))
	},
	handler: function(request, reply) {
		exports.saveMany(this.db, request.payload, function(err) {
			if (err) {
				return reply(err);
			}
			return reply();
		});
	}
};

exports.remove = {
	validate: {
		payload: Joi.array().items(Joi.object().keys({
			"name": Joi.string().required()
		}))
	},
	handler: function(request, reply) {
		exports.removeMany(this.db, request.payload, function(err) {
			if (err) {
				console.log(err);
				return reply(err);
			}

			return reply();
		});
	}
};

// Load Tags from database
exports.load = function(db, callback) {
	db.all('tag', function(err, tags) {
		if (err) {
			return callback(err);
		}

		return callback(null, tags);
	});
};

// Saves a Tag into the database
exports.saveMany = function(db, tags, callback) {
	db.insertMany('tag', tags, function(err) {
		if (err) {
			console.log("err" + err);
			return callback(err);
		}
		return callback();
	});
};

//remove many tags
exports.removeMany = function(db, tags, callback) {
	var sql = "delete from tag where ";

	for (var i = tags.length - 1; i >= 0; i--) {
		if (i === 0) {
			sql += "name=" + mysql.escape(tags[i].name) + "";
			break;
		}

		sql += "name= " + mysql.escape(tags[i].name) + ", "
	}

	sql += ";";
	db.sql(sql, function(err) {
		if (err) {
			console.log("err" + err);
			return callback(err);
		}
		return callback();
	});
};