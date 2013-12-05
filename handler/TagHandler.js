var factory = require('./Factory');
var util = require('../Util/utils');

exports.insertTag = function (req, res){
	var version = util.getVersion(req);
	factory.insertTag(res, version, req.body, function(err){
		if (err) {
			res.send(500, err.message);
		}
	});
}

exports.removeTag = function(req, res){
	var version = util.getVersion(req);
	factory.removeTag(res, version, req.body, function(err){
		if (err) {
			res.send(500, err.message);
		}
	});
}