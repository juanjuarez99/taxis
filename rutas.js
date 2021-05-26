module.exports = (app, connection) => {
	[
		"taxistas",
		"historial",
		"login",
		"entradasalida",
		"horario",
		"respaldos",
	].map((nombre) => {
		const ruta = require(`./rutas/${nombre}`);
		ruta.setup(app, connection);
	});
};
