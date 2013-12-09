var DBUtils = require('./Util/dbutils');
var mongoose = require('mongoose');
var Picture = require('./Model/V2Models').Picture;
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

var pictures = [];
//
//  search twitter for all tweets containing the word 'banana' since Nov. 11, 2011
//
T.get('search/tweets', { q: 'obama since:2013-09-08', count: 100 }, function(err, reply) {
  //console.log(util.inspect(reply, false, null));
  //console.log(JSON.stringify(reply, null, 4));
  //console.log("err: " + err);
  //console.log("count: ", Object.keys(reply.statuses[1].entities));
  //console.log("date: ", JSON.stringify(reply.statuses[1].entities), null, 1);
  //console.log("entities: ", JSON.stringify(reply.search_metadata), null, 3);
  /*for(var i in reply){
  	console.log(JSON.stringify(reply[i], null, 1));
  }*/
  var urls = [];
  for(var i in reply.statuses){
  	//console.log("count: ", Object.keys(reply.statuses[i].entities));
  	var date = reply.statuses[i].created_at;
  	var url = "";
  	if('media' in reply.statuses[i].entities){
  		//console.log(JSON.stringify(reply.statuses[i].entities.media[0].media_url));
		/*url = reply.statuses[i].entities.media[0].media_url;
		var p = {
			version: "v2",
			thumburl: url + ":thumb",
			url: url + ":large",
			tag: "life",
			date: new Date(date)
		};
		Picture.update({url: p.url, version: p.version, tag: p.tag}, p, {upsert: true}).exec();
		//pictures.push(p);*/
  	}
  	var urls = reply.statuses[i].entities.urls;
  	console.log(urls.length);
  	for(var j in urls){
  		//console.log(JSON.stringify(urls[0]));
  		console.log(JSON.stringify(urls[j].expanded_url));
  		url = reply.statuses[i].entities.urls[0].expanded_url;
  		if(url.indexOf("twitpic") > -1){
  			urls.push(url);
  		}
  	}
  }

  //console.log("pictures" + pictures);
  //console.log("urls: " + urls);
})
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