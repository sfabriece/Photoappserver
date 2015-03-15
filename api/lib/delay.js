"use strict";
var Joi = require('joi');
var mysql = require('mysql');
exports.get = {
	response: {
		schema: Joi.object().keys({
			"time": Joi.number().min(1).required()
		})
	},
	handler: function(request, reply) {
		exports.load(this.db, function(err, delay) {
			if (err) {
				console.log(err);
				return reply(err);
			}

			return reply(delay);
		});
	}
};

exports.put = {
	validate: {
		payload: Joi.object().keys({
			"time": Joi.number().min(1).required()
		})
	},
	handler: function(request, reply) {
		exports.updateOne(this.db, request.payload, function(err, delay) {
			if (err) {
				console.log(err);
				return reply(err);
			}

			return reply(delay);
		});
	}
};

// Load Delay from database
exports.load = function(db, callback) {
	db.getByAttr('delay', 'id', '0', function(err, res) {
		if (err) {
			return callback(err);
		}

		return callback(null, {
			time: res[0].time
		});
	});
};

//Update Delay to database
exports.updateOne = function(db, delay, callback) {
	var sql = "update delay set time = " + mysql.escape(delay.time) + " where id = 0;";
	db.sql(sql, function(err, rows) {
		if (err) {
			return callback(err);
		}

		return callback(null, {
			time: delay.time
		});
	});
};