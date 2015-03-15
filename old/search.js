var DBUtils = require('./Util/dbutils');
//var mongoose = require('mongoose');
var Picture = require('./Model/V2Models').Picture;
var Tag = require('./Model/V2Models').Tag;
var Twit = require('twit');
var Instagram = require('instagram').createClient('34fa91a54ccf404788dbc342ebd8cbf7', 'e6cb560183854e7c887f1bfbc0a1d8fb');

var T = new Twit({
    consumer_key:         'zSKUcDDSvV5FjknVRdStXQ',
	consumer_secret:      '8PuyN7CoIreHYme4RZqjvjG7dB9YOstriIfqwchH4us',
	access_token:         '50929382-RWUiOxEzc6Foa6lGn5Vi5IZjmTnfk2PitmviPU0Qt',
	access_token_secret:  'gdtVtHYnAAoyI19UNak0U8leYRmGVtah9egMrrJiCIDQ0'
})

/*mongoose.connect("localhost/test");
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log("Successfully connected to mongoDB. ");		
})	*/

var count = 0;
var numtags = 0;
//search twitter
var searchT = function(){
    DBUtils.getLatest(function(d){
        Tag.find({}, function (err, tags){
            if(!err){
            	//console.log("start: ");
                numtags = tags.length;
                var date = "" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
                //console.log("date: " + date);
                for(var i in tags){
                    searchTwitter(tags[i].name, date, searchI);
                }
            }else{
            	console.log("tag search error: " + err);
            }
        });
    });   
};

function searchTwitter(tag, date, next){

    var query = tag + " since:" + date;
    //console.log("query:" + query);
    T.get('search/tweets', { q: query, count: 100 }, function (err, reply) {
        //console.log("id: " + JSON.stringify(reply.search_metadata.max_id, null, 2));
    	if(!err){
            //console.log("in searchtwitter");
	        for(var i in reply.statuses){
	            var date = reply.statuses[i].created_at;
	            var url = "";
	            if('media' in reply.statuses[i].entities){

	                url = reply.statuses[i].entities.media[0].media_url;
	                var p = {
	                    version: "v2",
	                    thumburl: url + ":thumb",
	                    url: url + ":large",
	                    tag: tag,
	                    date: new Date(date)
	                };
	                Picture.update({url: p.url, version: p.version, tag: p.tag}, p, {upsert: true}).exec();
	            }
	            var urls = reply.statuses[i].entities.urls;

	            if(urls.length > 0){
	                var url = urls[0].expanded_url;
	                if(url.indexOf("twitpic") > -1){     
	                    var p = {
	                        version: "v2",
	                        thumburl: "http://twitpic.com/show/thumb/" + url.substring(19, url.length),
	                        url: "http://twitpic.com/show/large/" + url.substring(19, url.length),
	                        tag: tag,
	                        date: new Date(date)
	                    };       
	                    Picture.update({url: p.url, version: p.version, tag: p.tag}, p, {upsert: true}).exec();
	                }
	            }
	        }
	        if(++count == numtags){
	        	count = 0;
	        	//console.log("done twitter");
	        	next();
	            return;
	        }
	    }else{
	    	console.log("twitter search error: " +  err);
	    }
    });
}

//search instagram
var searchI = function(){
	Tag.find({}, function (err, tags){
        if(!err){
            numtags = tags.length;
            for(var i in tags){
                searchInstagram(tags[i].name);
            }
        }else{
        	console.log(" insta tag search error: " +  err);
        }
    });
};

function searchInstagram(tag){
    Tag.find({name: tag}, function(err, reply){
        var id = 0;
        if(!err){
            id = reply[0].min_id;
        }
        Instagram.tags.media(tag, {min_id:  id}, function (reply, err, pag) {
            if(!err){
                var minid = id;
                if(pag.min_tag_id){
                    minid = pag.min_tag_id;
                }
                var t = {version: "v2", name: tag, min_id: minid};
                Tag.update({version: "v2", name: tag}, t, {upsert: true}, function (err, n, r){
                    if(!err) {
                        //console.log("in searchInstagram");
                        for(var i in reply){
                            var dato = parseInt(reply[i].created_time) * 1000;
                            var p = {
                                version: "v2",
                                thumburl: reply[i].images.thumbnail.url,
                                url: reply[i].images.standard_resolution.url,
                                tag: tag,
                                date: new Date(dato),
                            };
                            Picture.update({url: p.url, version: p.version, tag: p.tag}, p, {upsert: true}).exec();
                        }

                        if(++count == numtags){
                            count = 0;
                            DBUtils.truncate();
                            //console.log("done!");
                            return;
                        }
                    }else{
                        console.log("error inserting min tag: " + err);
                    }
                });
            }else{
                console.log("instagram search error: " + err);
            }
        });
    });
}

exports.search = searchT;
//setInterval(searchT, 5000);

//db.close();
//console.log("db closed.");