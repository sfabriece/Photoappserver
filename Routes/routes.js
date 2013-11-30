/**
 * Contains routes to different services
 */
var DelayHandler = require('../handler/DelayHandler');
var PictureHandler = require('../handler/PictureHandler');

function setup(app){
	//Delay
	app.get('/api/delay', DelayHandler.getDelay);
	app.put('/api/delay/:value', DelayHandler.setDelay);
	app.post('/api/picture/addpictures', PictureHandler.insertPictures);
	app.get('/api/picture/getpictures', PictureHandler.getPictures);
	app.post('/api/picture/delete', PictureHandler.deletePictures);
}

exports.setup = setup;
