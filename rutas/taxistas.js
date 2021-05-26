module.exports = {
	setup: (app, connection) => {
		const route = "/taxistas";
		app.get(route, (_, res) => {
			//Muestra
			connection.query(
				"SELECT * FROM datospersonales",
				(error, result) => {
					if (error) {
						res.json(error);
						return;
					}
					res.json(result);
				}
			);
		});

		app.get(`${route}/:curp`, (req, res) => {
			//Muestra
			connection.query(
				`SELECT * FROM datospersonales WHERE curp = '${req.params.curp}'`,
				(error, result) => {
					if (error) {
						res.json(error);
						return;
					}
					res.json(result);
				}
			);
		});

		app.post(route, (req, res) => {
			//agrega
			const {
				nombre,
				apellido1,
				apellido2,
				curp,
				fechaDeRegistro,
				NumeroDeTelefono,
				entrada,
				salida,
			} = req.body;
			const query = `INSERT INTO datospersonales VALUES ('${nombre}', '${apellido1}', '${apellido2}', '${curp}', '${fechaDeRegistro}', '${NumeroDeTelefono}')`;
			connection.query(query, (error, result) => {
				if (error) {
					res.json(error);
					return;
				}
				connection.query(
					`INSERT INTO horario (curp, entrada, salida) VALUES ('${curp}', '${entrada}', '${salida}')`,
					(error, result) => {
						if (error) {
							res.json(error);
							return;
						}
						res.json({ status: "OK" });
					}
				);
			});
		});

		app.delete(route, (req, res) => {
			//elimina
			const { curp } = req.body;
			const query = `DELETE FROM datospersonales WHERE curp = '${curp}'`;
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
