var Delay = require('../Model/V1Models').Delay;
var Picture = require('../Model/V1Models').Picture;
var Tag = require('../Model/V2Models').Tag;
var Picture2 = require('../Model/V2Models').Picture;
var DBUtils = require('../Util/dbutils');

function VersionException(message){
	this.message = message;
	this.name = "VersionException";
}


function DBException(message){
	this.message = message;
	this.name = "DbException";
}

exports.getDelay = function(res, version, next){
	switch(version){
		case "v1":
			Delay.findOne({version: version}, function(err, delay){
				if(!delay) {
					return next(new DBException("400"));
				}else{
					res.send(200, {time: delay.time});
				}
			});
			break;
		case "v2":
			Delay.findOne({version: version}, function(err, delay){
				if(!delay) {
					return next(new DBException("400"));
				}else{
					res.send(200, {time: delay.time});
				}
			});
			break;
		default:
			return next(new VersionException("you must supply a Content-Type as shown in the documentation."));
	}
}

exports.setDelay = function(res, version, value, next){
	switch(version){
		case "v1":
			Delay.update({version: version}, {time: value}, {upsert: true}, function(err){
				if(err) return next(new DBException(err));
				else{
					res.send(200, {time: value});
				}
			});
			break;
		case "v2":
			Delay.update({version: version}, {time: value}, {upsert: true}, function(err){
				if(err) return next(new DBException(err));
				else{
					res.send(200, {time: value});
				}
			});
			break;
		default:
			return next(new VersionException("you must supply a Content-Type as shown in the documentation."));
	}
}


exports.insertPictures = function(res, version, body, next){
	/*var success = 0;
	var insert = function(picture, last){
		Picture.update({url: picture.url, version: version}, picture, {upsert: true}, function(err){
			if (!err) success++;
			if (last) {
				res.send(200, {successcount: success})
			};
		});
	};*/
	switch(version){
		case "v1":
			for (var i = body.length - 1; i >= 0; i--) {
				Picture.update({url: body[i].url, version: version}, body[i], {upsert: true}).exec();
			}
			res.send(200, {successcount: body.length});
			break;
		case "v2":
			//console.log(body);
			for (var i = body.length - 1; i >= 0; i--) {
				Picture2.update({url: body[i].url, version: version, tag: body[i].tag}, body[i], {upsert: true}).exec();
			}
			res.send(200, {successcount: body.length});
			setTimeout(DBUtils.truncate, 10000);
			break;
		default:
			return next(new VersionException("you must supply a Content-Type as shown in the documentation."));
	}
}

exports.getPictures = function (res, version, next){
	switch(version){
		case "v1":
				Picture.find({'version': version}, function(err, pictures){
					if(err) return next(new DBException(err));
					else{
						res.send(200, pictures);
						return;
					}
				});
			break;
		case "v2":
				Picture2.aggregate({$sort : { date: -1}}, {$limit : 100}).exec(function(err, pictures){
					res.send(200, pictures);
					return;
				});
			break;
		default:
			return next(new VersionException("you must supply a Content-Type as shown in the documentation."));
	}
}

exports.deletePictures = function (res, version, body, next){
	var deleted = 0;
	var last = false;
	var callback = function(err, picture){
		if(last){
			if(!err){
				deleted ++;
			}
			res.send(200, {deletecount: deleted});
		}else{
			if(!err){
				deleted ++;
			}
		}
	};

	var remove = function(pic){
		if(version === "v1"){
			Picture.remove({url: pic.url, version: version}, callback);
		}else{
			Picture2.remove({url: pic.url, version: version}, callback);
		}
	};

	switch(version){
		case "v1":
			for (var i = 0; i < body.length; i++) {
				if(i == (body.length - 1)){
					last = true;
					remove(body[i])
				}else{
					remove(body[i]);
				}
			}
			break;
		case "v2":
			for (var i = 0; i < body.length; i++) {
				if(i == (body.length - 1)){
					last = true;
					remove(body[i])
				}else{
					remove(body[i]);
				}
			}
			break;
		default:
			return next(new VersionException("you must supply a Content-Type as shown in the documentation."));
	}
}

exports.insertTag = function(res, version, body, next){
	if (!body.name) {return next(new DBException("no tag supplied!"))};
	switch(version){
		case "v2":
			Tag.update({version: version, name: body.name}, body, {upsert: true}, function(err, n, r){
				if(err) 
					return next(new DBException(err));
				else{
					res.send(200, {name: body.name});
				}
			});
			break;
		default:
			return next(new VersionException("you must supply a Content-Type as shown in the documentation."));
	}
}

exports.removeTag = function(res, version, body, next){
	if (!body || body.length === 0) {return next(new DBException("empty body!"))};
	var remove = function(tagg){
		Picture2.remove({tag: tagg}, function(err, count){
			if(count){
				Tag.remove({name: tagg}, function(err, count){
				});
			}else{
				return ;
			}
		});
	};
	switch(version){
		case "v2":
			for(var i = 0; i < body.length; i++){
				remove(body[i].name);
			}
			res.send(200);
			break;
		default:
			return next(new VersionException("you must supply a Content-Type as shown in the documentation."));
	}
}
