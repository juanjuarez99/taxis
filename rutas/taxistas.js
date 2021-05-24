module.exports = {
	setup: (app, connection) => {
		const route = "/taxistas";
		app.get(route, (_, res) => {
			connection.query("SELECT * FROM datospersonales", (error, result) => {
				if (error) {
					res.json(error);
					return;
				}
				res.json(result);
			});
		});

		app.post(route, (req, res) => {
			const {
				nombre,
				apellido1,
				apellido2,
				curp,
				fechaDeRegistro,
				NumeroDeTelefono,
			} = req.body;
			const query = `INSERT INTO datospersonales VALUES ('${nombre}', '${apellido1}', '${apellido2}', '${curp}', '${fechaDeRegistro}', '${NumeroDeTelefono}')`;
			connection.query(query, (error, result) => {
				if (error) {
					res.json(error);
					return;
				}
				res.json({ status: "OK" });
			});
		});
	},
};
