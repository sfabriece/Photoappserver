var Picture = require('../Model/V2Models').Picture;

exports.truncate = function(){
	Picture.aggregate({$sort : { date: -1}}, {$limit : 100}).exec(function(err, res){
		if(!err){
			var count  = res.length;
			console.log("count:" + count);
			if(count >= 100){
				var limit = res[count - 1];
				for (var i in res){
					console.log(res[i].date);
				}
				console.log("id:" + limit.date);
				Picture.remove({date:{$lt : limit.date}}, function(err, deleted){
					if (!err) {
						console.log("deleted: " + deleted);
						return deleted;
					}
					return 0;
				});
			}
			return 0;
		}
		return 0;
	});
};

exports.getLatest = function(){
	Picture.aggregate({$sort : { date: -1}}, {$limit : 1}).exec(function(err, res){
		return res;
	});
};