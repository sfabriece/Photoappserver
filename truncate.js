var DBUtils = require('./Util/dbutils');
var mongoose = require('mongoose');
var Picture = require('./Model/V2Models').Picture;
var Tag = require('./Model/V2Models').Tag;
var Twit = require('twit');

mongoose.connect("localhost/test");
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log("Successfully connected to mongoDB. ");		
})	

var T = new Twit({
    consumer_key:         'zSKUcDDSvV5FjknVRdStXQ',
	consumer_secret:      '8PuyN7CoIreHYme4RZqjvjG7dB9YOstriIfqwchH4us',
	access_token:         '50929382-RWUiOxEzc6Foa6lGn5Vi5IZjmTnfk2PitmviPU0Qt',
	access_token_secret:  'gdtVtHYnAAoyI19UNak0U8leYRmGVtah9egMrrJiCIDQ0'
})

//var pictures = [];
var count = 0;
var numtags = 0;
var search = function(){
    DBUtils.getLatest(function(d){
        Tag.find({}, function(err, tags){
            if(!err){
                numtags = tags.length;
                var date = "" + d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
                console.log("date: " + date);
                for(var i in tags){
                    searchTag(tags[i].name, date);
                }
            }
        });
    });   
};

function searchTag(tag, date){
    console.log("searchtag");
    var query = tag + " since:" + date;
    console.log("query:" + query);
    T.get('search/tweets', { q: query, count: 100 }, function(err, reply) {
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
                console.log("pic: " + p);
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

        if(++count == numtags){
            DBUtils.truncate();
            return;
        }
    });
}

//setInterval(search, 10000);
search();
/*var t = DBUtils.getLatest(function(t){
    console.log(t);
});
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
				date: d
			};
			Picture.update({url: p.url, version: "v2"}, p, {upsert: true}).exec();
		}	
	}
}

insertDummy();
DBUtils.truncate();*/

//db.close();
//console.log("db closed.");