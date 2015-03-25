module.exports = {
	product: {
		name: 'PhotoServer'
	},
	server: {
		api: {
			host: 'localhost' /*'172.31.33.205'*/ ,
			port: 12545
		}
	},
	database: {
		connectionLimit: 100,
		host: 'localhost',
		database: 'dbfabriece',
		user: 'fabriece',
		password: 'you-wish',
		multipleStatements: true,
		insecureAuth: true
	}
};