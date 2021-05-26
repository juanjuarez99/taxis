module.exports = { //Realiza el logeo a la BD
	setup: (app, connection) => {
		const route = "/login";
		app.post(route, (req, res) => {
			const { usuario, contra } = req.body;
			connection.query(
				`SELECT * FROM usuarios WHERE usuario = '${usuario}' AND contra = '${contra}'`,
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
