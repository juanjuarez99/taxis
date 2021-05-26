module.exports = {
	setup: (app, connection) => {
		const route = "/respaldos";
		app.get(route, (req, res) => {
			//Muestra
			connection.query(
				`SELECT * FROM respaldos WHERE TIME(hora) > now() - INTERVAL 5 MINUTE`,
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
