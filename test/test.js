var assert = require('assert');
var config = require('../Config/config');
var mongoose = require('mongoose');
var Delay = require('../Model/V1Models').Delay;
var Picture = require('../Model/V1Models').Picture;
var Picture2 = require('../Model/V2Models').Picture;
var Tag = require('../Model/V2Models').Tag;
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
		//Picture2.remove({url: {$ne: null}}, function(err){});
		//Tag.remove({name: {$ne: null}}, function(err){});
		db.close();
		console.log("db closed.");
		done();
	})//end after
	
	/*describe ('Delay Test', function(){
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
		})// end return pictures
	})// end pictures describe

	describe ('Pictures Test v2', function(){
		var req = new Request();
		req.set('Content-Type', 'application/v2+json');

		var pictures = [];
		pictures.push({thumburl: "aaa", url: "fff", date: new Date().getTime(), tag: "yo"});
		pictures.push({thumburl: "bbb", url: "zzz", date: new Date().getTime(), tag: "yo"});
		it('should insert pictures', function(done){	
			req.body = pictures;
			var res = new Response(finish);
			PictureHandler.insertPictures(req, res);

			function finish(){
				console.log("res: " + res.body);
				assert.equal(200, res.statusCode, res.body);
				assert.equal(2, res.body.successcount, res.body);
				done();
			}	
		})// end insert pictures

		it('should return pictures', function(done){
			var req = new Request();
			req.set('Content-Type', 'application/v2+json');
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
				Picture2.remove({url: {$ne: null}}, function(err){});
				done();
			}
		})// end return pictures
	})// end pictures v2 describe*/

	describe('Tag tests', function(){
		var req = new Request();
		req.set('Content-Type', 'application/v2+json');

		/*describe('remove tag', function(){
			var req = new Request();
			req.set('Content-Type', 'application/v2+json');
			var mytag = "custom";
			var tag2 = "yellow";

			it('should insert a tag before remove', function(done){
				req.body = {name:mytag};
				var res = new Response(finish);
				TagHandler.insertTag(req, res);

				function finish(){
					assert.equal(200, res.statusCode, res.body);
					assert.equal(mytag, res.body.name, res.body);
					done();
				}
			})// end insert a tag before remove

			it('should insert second tag before remove', function(done){
				req.body = {name:tag2};
				var res = new Response(finish);
				TagHandler.insertTag(req, res);

				function finish(){
					assert.equal(200, res.statusCode, res.body);
					assert.equal(tag2, res.body.name, res.body);
					done();
				}
			})// end insert second tag before remove

			it('should insert pictures before tag remove test', function(done){	
				var pictures = [];
				pictures.push({thumburl: "aaa", url: "fff", date: "1386806400", tag: mytag});
				pictures.push({thumburl: "bbb", url: "zzz", date: "1386806400", tag: mytag});
				pictures.push({thumburl: "aaa", url: "fff", date: "1386806400", tag: tag2});
				pictures.push({thumburl: "bbb", url: "zzz", date: "1386806400", tag: tag2});
				req.body = pictures;
				var res = new Response(finish);
				PictureHandler.insertPictures(req, res);

				function finish(){
					assert.equal(200, res.statusCode, res.body);
					assert.equal(4, res.body.successcount, res.body);
					done();
				}	
			})// end insert pictures before tag remove test

			it('should remove 2 tags', function(done){
				req.body = [{name: mytag}, {name: tag2}];
				var res = new Response(finish);
				TagHandler.removeTag(req, res);

				function finish(){
					assert.equal(200, res.statusCode, res.body);
					assert.equal(2, res.body, res.body);
					done();
				}
			})// end remove tags

			it('should return 0 pictures after remove tag', function(done){
				var res = new Response(finish);
				PictureHandler.getPictures(req, res);

				function finish(){
					assert.equal(200, res.statusCode, res.body);
					assert.equal(0, res.body.length, res.body);
					done();
				}
			})// end check pictures after remove tag

		})// end remove tag

		describe('return tags', function(){
			var req = new Request();
			req.set('Content-Type', 'application/v2+json');
			it('should insert first tag', function(done){
				req.body = {name:"fab"};
				var res = new Response(finish);
				TagHandler.insertTag(req, res);

				function finish(){
					assert.equal(200, res.statusCode, res.body);
					assert.equal("fab", res.body.name, res.body);
					done();
				}
			})// end add first tags

			it('should second tag', function(done){
				req.body = {name:"stian"};
				var res = new Response(finish);
				TagHandler.insertTag(req, res);

				function finish(){
					assert.equal(200, res.statusCode, res.body);
					assert.equal("stian", res.body.name, res.body);
					done();
				}
			})// end add second tags

			it('should second tag', function(done){
				req.body = {name:"jojo"};
				var res = new Response(finish);
				TagHandler.insertTag(req, res);

				function finish(){
					assert.equal(200, res.statusCode, res.body);
					assert.equal("jojo", res.body.name, res.body);
					done();
				}
			})// end add second tags

			it('should return 3 tags', function(done){
				var res = new Response(finish);
				TagHandler.getTags(req, res);

				function finish(){
					assert.equal(200, res.statusCode, res.body);
					assert.equal(3, res.body.length, res.body);
					done();
				}
			})

			it('should remove the three tags', function(done){
				req.body = [{name:"fab"}, {name:"stian"}, {name:"jojo"}];
				var res = new Response(finish);
				TagHandler.removeTag(req, res);
				
				function finish(){
					assert.equal(200, res.statusCode, res.body);
					assert.equal(3, res.body, res.body);
					done();
				}
			})

		})// end return tags*/

		describe('return pictures by tag', function(){
			var req = new Request();
			req.set('Content-Type', 'application/v2+json');
			var mytag = "custom";
			var tag2 = "yellow";

			it('should insert a tag before remove', function(done){
				req.body = {name:mytag};
				var res = new Response(finish);
				TagHandler.insertTag(req, res);

				function finish(){
					assert.equal(200, res.statusCode, res.body);
					assert.equal(mytag, res.body.name, res.body);
					done();
				}
			})// end insert a tag before remove

			it('should insert second tag before remove', function(done){
				req.body = {name:tag2};
				var res = new Response(finish);
				TagHandler.insertTag(req, res);

				function finish(){
					assert.equal(200, res.statusCode, res.body);
					assert.equal(tag2, res.body.name, res.body);
					done();
				}
			})// end insert second tag before remove

			it('should insert pictures before tag remove test', function(done){	
				var pictures = [];
				pictures.push({thumburl: "aaa", url: "fff", date: "1386806400", tag: mytag});
				pictures.push({thumburl: "bbb", url: "zzz", date: "1386806400", tag: mytag});
				pictures.push({thumburl: "aaa", url: "fff", date: "1386806400", tag: tag2});
				pictures.push({thumburl: "bbb", url: "zzz", date: "1386806400", tag: tag2});
				req.body = pictures;
				var res = new Response(finish);
				PictureHandler.insertPictures(req, res);

				function finish(){
					assert.equal(200, res.statusCode, res.body);
					assert.equal(4, res.body.successcount, res.body);
					done();
				}	
			})// end insert pictures before tag remove test

			it('should return pictures with the tag custom', function(done){
				req.params = {value: mytag};
				var res = new Response(finish);
				PictureHandler.getPicturesByTag(req, res);

				function finish(){
					assert.equal(200, res.statusCode, res.body);
					assert.equal(2, res.body.length, res.body);
					assert.equal(mytag, res.body[0].tag, res.body);
					done();
				}
			})

			it('should remove 2 tags', function(done){
				req.body = [{name: mytag}, {name: tag2}];
				var res = new Response(finish);
				TagHandler.removeTag(req, res);

				function finish(){
					assert.equal(200, res.statusCode, res.body);
					assert.equal(2, res.body, res.body);
					done();
				}
			})// end remove tags

			it('should return 0 pictures after remove tag', function(done){
				var res = new Response(finish);
				PictureHandler.getPictures(req, res);

				function finish(){
					assert.equal(200, res.statusCode, res.body);
					assert.equal(0, res.body.length, res.body);
					done();
				}
			})// end check pictures after remove tag
		})// end return pictures by tag
		
	})// end tag describe
})// end Test