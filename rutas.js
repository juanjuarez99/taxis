module.exports = (app, connection) => {
	["taxistas", "historial"].map((nombre) => {
		const ruta = require(`./rutas/${nombre}`);
		ruta.setup(app, connection);
	});
};
