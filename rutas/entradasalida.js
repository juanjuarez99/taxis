module.exports = {
	setup: (app, connection) => {
		const route = "/entradasalida"; //Muestra todas las entradas y salidas de hoy.
		app.get(route, (_, res) => {
			//Muestra
			connection.query(
				"SELECT * FROM entradasalida WHERE DATE(dia) = CURRENT_DATE",
				(error, result) => {
					if (error) {
						res.json(error);
						return;
					}
					res.json(result);
				}
			);
		});

		app.get(`${route}/recientes`, (_, res) => { //Muestra entradas y salidas recientes
			//Muestra
			connection.query(
				"SELECT * FROM entradasalida WHERE DATE(dia) = CURRENT_DATE AND (TIME(entrada) > now() - INTERVAL 5 MINUTE OR (salida > now() - INTERVAL 5 MINUTE AND salida < now() + INTERVAL 1 MINUTE))",
				(error, result) => {
					if (error) {
						res.json(error);
						return;
					}
					res.json(result);
				}
			);
		});

		app.post(route, (req, res) => { //Agrega las entradas y salidas dependiendo de cuando se registren
			//agrega                      si no existe una entrada la crea, si existe añade la salida
			const { curp, entrada, salida } = req.body;
			let query = `SELECT * FROM entradasalida WHERE curp = '${curp}'`;
			connection.query(query, (error, result) => {
				if (error) {
					res.json(error);
					return;
				}
				if (result.length < 1) { 
					query = `INSERT INTO entradasalida (curp, entrada) VALUES ('${curp}', '${entrada}')`;
					connection.query(
						query,
						(error, result) => {
							if (error) {
								res.json(error);
								return;
							}
							res.json(result);
						}
					);
				} else {
					query = `UPDATE entradasalida SET salida = '${salida}' WHERE entradasalida.curp = '${curp}' AND DATE(dia) = CURRENT_DATE`;
					connection.query(
						query,
						(error, result) => {
							if (error) {
								res.json(error);
								return;
							}
							res.json(result);
						}
					);
				}
			});
		});
	},
};
