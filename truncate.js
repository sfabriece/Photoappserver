var DBUtils = require('./Util/dbutils');
var mongoose = require('mongoose');
var Picture = require('./Model/V2Models').Picture;

mongoose.connect("localhost/test");
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
	console.log("Successfully connected to mongoDB. ");		
})	
/*var pictureSchema = new Schema({
	version: {type: String, default: 'v2'},
	thumburl: String,
	url: String,
	tag: {type: String, default: "undefined"},
	date: Date
});*/
function makeid()
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
DBUtils.truncate();

//db.close();
//console.log("db closed.");