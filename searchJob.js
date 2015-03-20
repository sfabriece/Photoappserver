var CronJob = require('cron').CronJob;
var job = new CronJob("*/1 * * * * *", function() {
	console.log('time is ' + new Date());
}, null, false, "Europe/Oslo");

job.start();