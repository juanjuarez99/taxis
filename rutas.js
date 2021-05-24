module.exports = (app, connection) => {
	["taxistas"].map((nombre) => {
		const ruta = require(`./rutas/${nombre}`);
		ruta.setup(app, connection);
	});
};
