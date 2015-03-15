//Load modules
var Pictures = require('./pictures');
var Delay = require('./delay')
var Tags = require('./tags')

// API Server Endpoints
exports.endpoints = [

	{
		method: 'GET',
		path: '/pictures',
		config: Pictures.get
	}, {
		method: 'POST',
		path: '/pictures',
		config: Pictures.post
	}, {
		method: 'DELETE',
		path: '/pictures',
		config: Pictures.remove
	}, {
		method: 'GET',
		path: '/pictures/{tag}',
		config: Pictures.getByTag
	}, {
		method: 'GET',
		path: '/delay',
		config: Delay.get
	}, {
		method: 'PUT',
		path: '/delay',
		config: Delay.put
	}, {
		method: 'GET',
		path: '/tags',
		config: Tags.get
	}, {
		method: 'DELETE',
		path: '/tags',
		config: Tags.remove
	}, {
		method: 'POST',
		path: '/tags',
		config: Tags.post
	}

];