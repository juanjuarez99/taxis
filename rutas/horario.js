module.exports = {
	setup: (app, connection) => {
		const route = "/horario/:curp";
		app.get(route, (req, res) => {
			//Muestra
			connection.query(
				`SELECT * FROM horario WHERE curp = '${req.params.curp}'`,
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
