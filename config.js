module.exports = {
	product: {
		name: 'PhotoServer'
	},
	server: {
		api: {
			host: 'localhost' /*'172.31.33.205'*/ ,
			port: 8080
		}
	},
	database: {
		connectionLimit: 100,
		host: 'localhost',
		database: 'photo_db',
		user: 'root',
		password: 'developer',
		multipleStatements: true
	}
};