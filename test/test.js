var assert = require('assert');
var config = require('../Config/config');
var mongoose = require('mongoose');
var Delay = require('../Model/V1Models').Delay;
var Picture = require('../Model/V1Models').Picture;
var DelayHandler = require('../handler/DelayHandler');
var PictureHandler = require('../handler/PictureHandler');
var TagHandler = require('../handler/TagHandler');
var Request = require('./mock').Request;
var Response = require('./mock').Response;
var utils = require('../Util/utils');


describe ('Test', function(){

	it('util test', function(done){
		var req = new Request();
		req.set('Content-Type', 'application/v1+json');
		assert.equal('v1', utils.getVersion(req));
		done()
	})// end util test

	before(function(done){

		console.log("Connection to mongoDB..");
		mongoose.connect(config.dev.test.mongodb);
		db = mongoose.connection;
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function(){
			console.log("Successfully connected to mongoDB. ");
			done();
		})				
	})//end before

	after(function(done){
		Delay.remove({version: "v1", time: 4}, function(err){});
		Picture.remove({url: {$ne: null}}, function(err){});
		db.close();
		console.log("db closed.");
		done();
	})//end after
	
	describe ('Delay Test', function(){
		it('should insert delay of 4', function(done){
			var req = new Request(4);
			req.set('Content-Type', 'application/v1+json');
			var res = new Response(finish);
			DelayHandler.setDelay(req, res);

			function finish(){
				assert.equal(200, res.statusCode);
				assert.equal(4, res.body.time);
				done();
			}
		})//end insert delay 4

		it('should return delay 4', function(done){
			var req = new Request();
			req.set('Content-Type', 'application/v1+json');
			var res = new Response(finish);
			DelayHandler.getDelay(req, res);
			function finish(){
				assert.equal(200, res.statusCode, res.body);
				assert.equal(4, res.body.time, res.body);
				done();
			}	
		})// end get delay
	})//end delay describe

	describe ('Pictures Test', function(){
		var req = new Request();
		req.set('Content-Type', 'application/v1+json');

		var pictures = [];
		pictures.push({thumburl: "aaa", url: "fff"});
		pictures.push({thumburl: "bbb", url: "zzz"});
		it('should insert pictures', function(done){	
			req.body = pictures;
			var res = new Response(finish);
			PictureHandler.insertPictures(req, res);

			function finish(){
				assert.equal(200, res.statusCode, res.body);
				assert.equal(2, res.body.successcount, res.body);
				done();
			}	
		})// end insert pictures

		it('should return pictures', function(done){
			var req = new Request();
			req.set('Content-Type', 'application/v1+json');
			var res = new Response(finish);
			PictureHandler.getPictures(req, res);

			function finish(){
				assert.equal(200, res.statusCode, res.body);
				assert.notEqual(0, res.body.length, res.body);
				assert.equal("bbb", res.body[0].thumburl, res.body);
				done();
			}
		})// end return pictures

		it('should delete one picture', function(done){
			var urls = [];
			urls.push({url: "zzz"});
				
			req.body = urls;
			var res = new Response(finish);
			PictureHandler.deletePictures(req, res);

			function finish(){
				assert.equal(200, res.statusCode, res.body);
				assert.equal(1, res.body.deletecount, res.body);
				done();
			}
		})// end delete one picture

		it('should return one picture', function(done){
			var res = new Response(finish);
			PictureHandler.getPictures(req, res);

			function finish(){
				assert.equal(200, res.statusCode, res.body);
				assert.equal(1, res.body.length, res.body);
				assert.equal("aaa", res.body[0].thumburl, res.body);
				done();
			}
		})// end return pictures*/
	})// end pictures describe

	describe('Tag tests', function(){
		var req = new Request();
		req.set('Content-Type', 'application/v2+json');
		it('should insert a tag', function(done){
			req.body = {name:"uis"};
			var res = new Response(finish);
			TagHandler.insertTag(req, res);

			function finish(){
				assert.equal(200, res.statusCode, res.body);
				assert.equal("uis", res.body.name, res.body);
				done();
			}
		})// end insert tag
	})// end tag describe
})// end Test