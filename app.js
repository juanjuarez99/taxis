const express = require("express");
const cors = require("cors");
const mysql = require("mysql");

const config = require("./config");

const app = express();
const port = config.SERVER_PORT;

app.use(cors());
app.options("*", cors());
app.use(require("body-parser").json());

const connection = mysql.createConnection({
	host: config.DB_IP,
	user: config.DB_USER,
	password: config.DB_PASS,
	database: config.DB_NAME,
});

connection.connect();

const routes = require("./rutas");
routes(app, connection);

const server = app.listen(port, () => {
	console.log(`Servidor disponible en puerto ${port}`);
});

const automation = require("./automation");
automation(connection);
