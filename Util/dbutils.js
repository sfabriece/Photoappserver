var Picture = require('../Model/V2Models').Picture;

exports.truncate = function(){
	Picture.aggregate({$sort : { date: -1}}, {$limit : 100}).exec(function(err, res){
		if(!err){
			var count  = res.length;
			//console.log("count:" + count);
			if(count >= 100){
				var limit = res[count - 1];
				//console.log("id:" + limit.date);
				Picture.remove({date:{$lt : limit.date}}, function(err, deleted){
					if (!err) {
						//console.log("deleted: " + deleted);
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

exports.getLatest = function(next){
	Picture.aggregate({$sort : { date: -1}}, {$limit : 1}).exec(function(err, res){
		if(!err){
			if(res.length > 0){
				return next(res[0].date);
			}else{
				return next(new Date(2013, 9, 1));
			}
		}else{
			return next(new Date());
		}
	});
};

exports.getLatestInst = function(next){
	Picture.aggregate({$sort : { idf: -1}}, {$limit : 1}).exec(function(err, res){
		if(!err){
			if(res.length > 0){
				if(res[0].idf){
					return next(res[0].idf);
				}else{
					return next(0);
				}
			}else{
				return next(0);
			}
		}else{
			return next(0);
		}
	});
};
