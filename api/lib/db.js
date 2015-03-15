// Load modules
var mysql = require('mysql');
var Boom = require('boom');
// Declare internals
var internals = {};
module.exports = internals.Db = function(options) {
	this._options = options;
	this.pool = mysql.createPool(options);
};

internals.Db.prototype.initialize = function(callback) {
	this.pool.getConnection(function(err, connection) {
		connection.release();
		if (err) {
			pool.end();
		}
		callback(err);
	});
}

//get the whole table
internals.Db.prototype.all = function(table, callback) {
	var sql = "select * from " + table + ";";
	this.pool.query(sql, function(err, rows) {
		if (err) {
			return callback(err);
		}

		if (!rows) {
			return callback(internals.error("rows not defined when getting table", table, 'all'));
		}

		return callback(null, rows);
	});
}

//get all by an attribute
internals.Db.prototype.getByAttr = function(table, attr, val, callback) {
	if (!table || !attr || !val) {
		return internals.error("undefined or null on one of arguments", table, "getByattr");
	}

	var sql = 'select * from ' + table + ' where ' + attr + ' = ' + this.pool.escape(val);
	//console.log(sql);
	this.pool.query(sql, function(err, rows) {
		if (err) {
			return callback(err)
		}

		if (!rows) {
			return callback(internals.error("rows not defined when getting table", table, 'all'));
		}

		return callback(null, rows);
	});
}

// insert many items into a table
internals.Db.prototype.insertMany = function(table, items, callback) {
	console.log("db" + JSON.stringify(items));
	var sql = "";
	for (var i = items.length - 1; i >= 0; i--) {
		var item = items[i];
		var keys = Object.keys(item);
		sql += "insert into " + table + " (";
		for (var j = keys.length - 1; j >= 0; j--) {
			if (j === 0) {
				sql += keys[j];
				break;
			}
			sql += keys[j] + ", ";
		}

		sql += ") values (";
		for (var k = keys.length - 1; k >= 0; k--) {
			if (k == 0) {
				sql += mysql.escape(item[keys[k]]);
				break;
			};
			9
			sql += mysql.escape(item[keys[k]]) + ", ";
		};
		sql += ");"
	}

	console.log(sql);
	this.pool.query(sql, function(err, res) {
		console.log("return from db");
		if (err) {
			console.log("db err: " + err);
			return callback(err);
		};

		console.log("db success");
		return callback(null, res);
	});
};

// insert one item into a table
internals.Db.prototype.insertOne = function(table, item, callback) {
	var sql = "";
	var keys = Object.keys(item);
	sql += "insert into " + table + " (";
	for (var j = keys.length - 1; j >= 0; j--) {
		if (j === 0) {
			sql += keys[j];
			break;
		}
		sql += keys[j] + ", ";
	}

	sql += ") values (";
	for (var k = keys.length - 1; k >= 0; k--) {
		if (k == 0) {
			sql += mysql.escape(item[keys[k]]);
			break;
		};
		9
		sql += mysql.escape(item[keys[k]]) + ", ";
	};
	sql += ");"
	console.log(sql);

	this.pool.query(sql, function(err, rows) {
		if (err) {
			return callback(internals.error(err, table, 'inserting one item'));
		};

		return callback();
	});
};

// run custom sql
internals.Db.prototype.sql = function(sql, callback) {
	this.pool.query(sql, function(err, rows) {

		if (err) {
			return callback(internals.error(err, 'no table', 'running custome sql'));
		};

		return callback(null, rows);
	});
};
// Construct error artifact

internals.error = function(error, table, action, input) {

	return Boom.internal('Database error', {
		error: error,
		table: table,
		action: action,
		input: input
	});
};