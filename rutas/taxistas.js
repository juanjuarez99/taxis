module.exports = {
	setup: (app) => {
		const route = "/";
		app.get(route, (req, res) => {
			res.send("Gracias Mani xD");
		});
	},
};
