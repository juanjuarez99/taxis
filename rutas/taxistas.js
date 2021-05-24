module.exports = {
	setup: (app) => {
		const route = "/";
		app.get(route, (req, res) => {
			res.send("hola");
		});
	},
};
