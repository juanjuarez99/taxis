const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.options("*", cors());
app.use(require("body-parser").json());

const routes = require("./rutas");
routes(app);

const server = app.listen(port, () => {
	console.log(`Servidor disponible en puerto ${port}`);
});
