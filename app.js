const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const config = require("./config");

const app = express();
const port = config.SERVER_PORT;

app.use(cors());
app.options("*", cors());
app.use(require("body-parser").json());

const si = require("serve-index");
app.use("/pdf/historial", express.static(__dirname + "/pdfs"), si(__dirname + "/pdfs", { icons: true }));
app.use("/pdf/borrados", express.static(__dirname + "/borrados"), si(__dirname + "/borrados", { icons: true }));

const connection = mysql.createConnection({
	host: config.DB_IP,
	user: config.DB_USER,
	password: config.DB_PASS,
	database: config.DB_NAME,
	port: config.DB_PORT
});

connection.connect();

const routes = require("./rutas");
routes(app, connection);

const server = app.listen(port, () => {
	console.log(`Servidor disponible en puerto ${port}`);
});

const automation = require("./automation");
automation(connection);
