module.exports = (app, connection) => {
	["taxistas", "historial", "login"].map((nombre) => {
		const ruta = require(`./rutas/${nombre}`);
		ruta.setup(app, connection);
	});
};
