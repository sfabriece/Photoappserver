var Db = require('./db');
//var Hoek = require('hoek');
var Routes = require('./routes');

var internals = {};

exports.register = function(server, options, next) {
	var database = new Db(server.app.config.database);
	server.bind({
		config: server.app.config,
		vault: server.app.vault,
		db: database
	});

	server.route(Routes.endpoints);
	/*server.ext('onRequest', function(request, reply) {
		console.log("onReq: " + request.payload);
		reply.continue();
	});
	server.ext('onPreHandler', function(request, reply) {
		console.log("onPreHandler: " + request.payload);
		reply.continue();
	});
	server.ext('onPostAuth', function(request, reply) {
		console.log("onPostAuth: " + request.payload);
		reply.continue();
	});
	server.ext('onPostHandler', function(request, reply) {
		console.log("onPostHandler: " + request.payload);
		reply.continue();
	});
	server.ext('onPreResponse', function(request, reply) {
		console.log("onPreResponse: " + request.payload);
		reply.continue();
	});*/

	database.initialize(function(err) {
		if (err) {
			console.log(err);
			process.exit(1);
		}
		//initialize models
		return next();
	});
};
exports.register.attributes = {
	pkg: require('../package.json')
}