var CronJob = require('cron').CronJob;
new CronJob("*/5 * * * * *", function() {
	console.log('You will see this message every second');
}, null, true, "Europe/Oslo");