module.exports = (app) => {
	["taxistas"].map((nombre) => {
		const ruta = require(`./rutas/${nombre}`);
		ruta.setup(app);
	});
};
