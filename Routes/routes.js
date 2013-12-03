/**
 * Contains routes to different services
 */
var DelayHandler = require('../handler/DelayHandler');
var PictureHandler = require('../handler/PictureHandler');
var TagHandler = require('../handler/TagHandler');

function setup(app){
	//Delay
	app.get('/api/delay', DelayHandler.getDelay);
	app.put('/api/delay/:value', DelayHandler.setDelay);
	app.post('/api/picture/addpictures', PictureHandler.insertPictures);
	app.post('/api/tag/addtag', TagHandler.insertTag);
	app.get('/api/picture/getpictures', PictureHandler.getPictures);
	app.post('/api/picture/delete', PictureHandler.deletePictures);
}

exports.setup = setup;
