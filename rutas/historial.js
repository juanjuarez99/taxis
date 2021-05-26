module.exports = {
	//Muestra el historial
	setup: (app, connection) => {
		const route = "/historial";
		app.get(route, (_, res) => {
			connection.query(
				"SELECT * FROM log_historial",
				(error, result) => {
					if (error) {
						res.json(error);
						return;
					}
					res.json(result);
				}
			);
		});

		app.get(`${route}/5min`, (_, res) => {
			connection.query(
				"SELECT * FROM log_historial WHERE Fecha > now() - INTERVAL 5 MINUTE",
				(error, result) => {
					if (error) {
						res.json(error);
						return;
					}
					res.json(result);
				}
			);
		});
	},
};
