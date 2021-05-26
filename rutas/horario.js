module.exports = {
	setup: (app, connection) => {
		const route = "/horario/:curp"; //Muestra el horario de la persona dependiendo su CURP
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
