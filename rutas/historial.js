module.exports = {
	setup: (app, connection) => {
		const route = "/historial";
		app.get(route, (_, res) => {
			connection.query("SELECT * FROM log_historial", (error, result) => {
				if (error) {
					res.json(error);
					return;
				}
				res.json(result);
			});
		});
	},
};
