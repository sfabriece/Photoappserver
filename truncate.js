var DBUtils = require('./Util/dbutils');
var mongoose = require('mongoose');
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

mongoose.connect("localhost/test");
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log("Successfully connected to mongoDB. ");		
})	

var count = 0;
var numtags = 0;
//search twitter
var searchT = function(){
    DBUtils.getLatest(function(d){
        Tag.find({}, function (err, tags){
            if(!err){
            	console.log("searchT");
                numtags = tags.length;
                var date = "" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
                //console.log("date: " + date);
                for(var i in tags){
                    searchTwitter(tags[i].name, date, searchI);
                }
            }else{
            	console.log("tag search error: ", err);
            }
        });
    });   
};

function searchTwitter(tag, date, next){

    var query = tag + " since:" + date;
    //console.log("query:" + query);
    T.get('search/tweets', { q: query, count: 100 }, function (err, reply) {
    	if(!err){
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
	                    date: new Date(date),
	                    idf: 0
	                };
	                //console.log("twitpic: " + JSON.stringify(p, null, 3));
	                Picture.update({url: p.url, version: p.version, tag: p.tag}, p, {upsert: true}).exec();
	                //console.log("pic: " + p);
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
	                    //pictures.push(p);
	                }
	            }
	        }
	        console.log("count: " + count + " numtags: " + numtags);
	        if(++count == numtags){
	        	count = 0;
	        	console.log("done twitter");
	        	next();
	            return;
	        }
	    }else{
	    	console.log("twitter search error: ", err);
	    }
    });
}

//search instagram
var searchI = function(){
	DBUtils.getLatestInst(function (id){
		Tag.find({}, function (err, tags){
            if(!err){
                numtags = tags.length;
                for(var i in tags){
                    searchInstagram(tags[i].name, id);
                }
            }else{
            	console.log(" insta tag search error: ", err);
            }
        });
	});
};
var pics = [];
function searchInstagram(tag, id){
	Instagram.tags.media(tag, {min_id:  5}, function (reply, err) {
		console.log(JSON.stringify(reply.pagination, null, 8));
		if(!err){
			console.log("in instagram");
		    for(var i in reply){
		    	var id = reply[i].caption.id;
		    	console.log(id);
		    	//extract the complete number.
		    	/*var first = idString.substring(0, idString.indexOf("_"));
		    	var last = idString.substring(idString.indexOf("_") + 1, idString.length);
		    	var id = parseInt(first + last);*/
		        var dato = parseInt(reply[i].created_time) * 1000;
		        var p = {
		            version: "v2",
		            thumburl: reply[i].images.thumbnail.url,
		            url: reply[i].images.standard_resolution.url,
		            tag: tag,
		            date: new Date(dato),
		            idf: id
		        };
		        //console.log("instapic: " + JSON.stringify(p, null, 3));
		        Picture.update({url: p.url, version: p.version, tag: p.tag}, p, {upsert: true}).exec();
		        //pics.push(reply[i].id);
		    }

		    if(++count == numtags){
		    	count = 0;
	            DBUtils.truncate();
	            console.log("done!");
	            //console.log(JSON.stringify(pics, null, 6));
	            return;
	        }
    	}else{
    		console.log("instagram search error: ", err);
    	}
	});
}

setInterval(searchT, 5000);
//searchT();
/*var t = DBUtils.getLatestInst(function(t){
    console.log(t);
});*/
/*var pictureSchema = new Schema({
	version: {type: String, default: 'v2'},
	thumburl: String,
	url: String,
	tag: {type: String, default: "undefined"},
	date: Date
});*/
/*function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function insertDummy(){
	for(var i = 0; i < 2; i++){
		for(var j = 1; j < 28; j++ ){
			var d = new Date(2013, i, j);
			var p = {
				thumburl: makeid(),
				url: makeid(),
				tag: "john",
				date: d,
				idf: i*j
			};
			Picture.update({url: p.url, version: "v2"}, p, {upsert: true}).exec();
		}	
	}
}

insertDummy();
//DBUtils.truncate();*/

//db.close();
//console.log("db closed.");