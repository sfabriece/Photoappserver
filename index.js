"use strict";
// Load modules
var Path = require('path');
var Hapi = require('hapi');
var Config = require('./config');
var Vault = require('./vault');

/*var Joi = require('joi');

var schema = Joi.array().items(Joi.object().keys({
	name: Joi.string().required(),
	version: Joi.number().required().min(1)
}));

Joi.validate([{
		name: "test",
		version: 1
		}], schema,
	function(err, value) {
		console.log("error: " + err);
		console.log("value: " + JSON.stringify(value));
	}); // err === null -> valid*/

// Declare internals
var internals = {};
Config.server.api.uri = (Config.server.api.tls ? 'https://' : 'http://') +
	Config.server.api.host + ':' + Config.server.api.port;
var manifest = {
	servers: [{
		host: Config.server.api.host,
		port: Config.server.api.port,
		labels: 'api'
	}],
	plugins: [{
		register: require('./api')
	}]
};
var server = new Hapi.Server({
	debug: {
		request: [/*'error', 'received'*/]
	}
});

//add global state to Server
server.app.config = Config;
server.app.vault = Vault;

//add connections
var api = server.connection(manifest.servers[0]);

//register plugins
server.register(manifest.plugins[0], {
	select: 'api'
}, function(err) {
	if (err) {
		console.log("Failed to register plugin!");
		process.exit(1);
	}
});

//start server
server.start(function(err) {
	if (err) {
		console.log("SERVER Failed to start!");
		process.exit(1);
	}
	for (var i = 0, n = server.connections.length; i < n; i++) {
		console.log("Hapi server started @", server.connections[i].info.uri);
	}
	//console.log("Hapi server started @", server.info.uri);
});