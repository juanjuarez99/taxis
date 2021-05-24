module.exports = {
	setup: (app, connection) => {
		const route = "/";
		app.get(route, (req, res) => {
			connection.query(
				"SELECT * FROM datospersonales",
				(error, result, fields) => {
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