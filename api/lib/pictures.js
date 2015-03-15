var Boom = require('boom');
var Joi = require('joi');
var mysql = require('mysql');

exports.get = {
	handler: function(request, reply) {
		exports.load(this.db, function(err, pictures) {
			if (err) {
				return reply(err);
			}

			return reply(pictures);
		});
	}
};

exports.getByTag = {
	validate: {
		params: {
			tag: Joi.string().required()
		}
	},
	handler: function(request, reply) {
		exports.loadBytag(this.db, request.params.tag, function(err, pictures) {
			if (err) {
				return reply(err);
			}

			return reply(pictures);
		});
	}
};

exports.post = {
	validate: {
		payload: Joi.array().items(Joi.object().keys({
			url: Joi.string().required(),
			thumbUrl: Joi.string().required(),
			date: Joi.date().required(),
			tag: Joi.string().required()
		}))
	},
	handler: function(request, reply) {
		exports.saveMany(this.db, request.payload, function(err) {
			if (err) {
				console.log(err);
				return reply(err);
			}

			return reply();
		});
	}
};

exports.remove = {
	validate: {
		payload: Joi.array().items(Joi.object().keys({
			url: Joi.string().required()
		}))
	},
	handler: function(request, reply) {
		exports.removeMany(this.db, request.payload, function(err, teams) {
			if (err) {
				console.log(err);
				return reply(err);
			}

			return reply(teams);
		});
	}
};

// Load Pictures from database
exports.load = function(db, callback) {
	var query = "select * from picture group by url";
	db.sql(query, function(err, pictures) {
		if (err) {
			return callback(err);
		}

		return callback(null, pictures);
	});
};

// Load Pictures from database
exports.loadBytag = function(db, tag, callback) {
	db.getByAttr('picture', 'tag', tag, function(err, pictures) {
		if (err) {
			return callback(err);
		}

		return callback(null, pictures);
	});
};

// save Pictures from database
//TODO load one and one using async
exports.saveMany = function(db, pictures, callback) {
	db.insertMany('picture', pictures, function(err) {
		if (err) {
			return callback(err);
		}

		return callback();
	});
};

//remove many pictures
exports.removeMany = function(db, pics, callback) {
	var sql = "delete from picture where ";

	for (var i = pics.length - 1; i >= 0; i--) {
		if (i === 0) {
			sql += "url=" + mysql.escape(pics[i].url) + "";
			break;
		}

		sql += "url= " + mysql.escape(pics[i].url) + ", "
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