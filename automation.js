const htmltopdf = require("html-pdf-node");
const CronJob = require("cron").CronJob;
const mysqldump = require("mysqldump");
const config = require("./config");

module.exports = (connection) => {
	generatePDF(connection); //se genera PDF de historial
	backupDatabase(); //respaldo a la BD
	const pdfHistorial = new CronJob(
		"0 */2 * * * *", //cada 2 min
		() => {
			generatePDF(connection); //genera PDF de Historial
		},
		null,
		true,
		"America/Mexico_City"
	);
	const recentDeleted = new CronJob(
		"0 */3 * * * *", //Cada 3 min genera el PDF de Eliminados
		() => {
			pdfDeleted(connection); //Genera PDF
		},
		null,
		true,
		"America/Mexico_City"
	);
	const databaseBackup = new CronJob(
		"0 */4 * * * *", //Cada 4 min
		() => {
			backupDatabase(connection); //Respaldo de la BD
		},
		null,
		true,
		"America/Mexico_City"
	);
	// const deleteOldLog = new CronJob(
	// 	"0 */20 * * * *",
	// 	() => {
	// 		deleteOld(connection);
	// 	},
	// 	null,
	// 	true,
	// 	"America/Mexico_City"
	// );
};

const pdfDeleted = (connection) => {
	//funcion para generar PDF de borrados
	connection.query(
		"SELECT * FROM log_historial WHERE Operacion = 'Delete' AND Fecha > now() - INTERVAL 3 MINUTE",
		(error, result) => {
			if (error) {
				console.log(error);
				return;
			}
			if (result.length < 1) return;
			const d = new Date();
			let content = `
		<style>
			table, td { border: 1px solid black; }
		</style>
		<h1>Borrados recientes al ${d.toLocaleDateString(
			"es"
		)} ${d.toLocaleTimeString()}</h1>
		<table>
			<thead>
				<tr>
					<th>Tabla</th>
					<th>Usuario</th>
					<th>Fecha</th>
					<th>Descripción</th>
				<tr>
			</thead>
			<tbody>`;
			result.forEach((entry) => {
				content += `<tr>
				<td>${entry.Tabla}</td>
				<td>${entry.Usuario}</td>
				<td>${entry.Fecha}</td>
				<td>${entry.Descripcion}</td>
					</tr>`;
			});
			content += "</tbody></table>";
			htmltopdf
				.generatePdf(
					//genera PDF
					{ content },
					{
						path: `./borrados/borrados-recientes ${d //ruta de almacenado de PDF
							.toLocaleDateString(
								"es"
							)
							.replace(
								/\//g,
								"-"
							)} ${d
							.toLocaleTimeString()
							.replace(
								/:/g,
								"-"
							)}.pdf`,
					}
				)
				.then(() => {
					console.log(
						`Generado PDF de borrados recientes a las ${new Date().toLocaleTimeString()}`
					);
				});
		}
	);
};

const deleteOld = (connection) => {
	//Elimina todo lo viejito anterior a 5 min
	connection.query(
		"DELETE FROM log_historial WHERE Fecha < now() - INTERVAL 20 MINUTE",
		(error) => {
			if (error) {
				console.log(error);
				return;
			}
		}
	);
};

const backupDatabase = (connection) => {
	//fuancion para exportar BD
	mysqldump(
		{
			connection: {
				host: config.DB_IP,
				user: config.DB_USER,
				password: config.DB_PASS,
				database: config.DB_NAME,
			},
			dumpToFile: `${
				config.BACKUP_FILE //Dirección en config
			}respaldo--${new Date()
				.toLocaleTimeString()
				.replace(/:/g, "-")}.sql`,
		},
		(err) => {
			if (err) {
				console.log(err);
				return;
			}
			connection.query(
				`INSERT INTO respaldos VALUES ()`,
				(error, result) => {
					if (error) {
						console.log(error);
						return
					}
					console.log(result)
				}
			);
		}
	);
};

const generatePDF = (connection) => {
	//genera PDF de historial
	connection.query("SELECT * FROM log_historial", (error, result) => {
		if (error) {
			console.log(error);
			return error;
		}
		if (result.length < 1) return;
		const d = new Date();
		let content = `
		<style>
			table, td { border: 1px solid black; }
		</style>
		<h1>Historial del ${d.toLocaleDateString("es")} ${d.toLocaleTimeString()}</h1>
		<table>
			<thead>
				<tr>
					<th>Operacion</th>
					<th>Tabla</th>
					<th>Usuario</th>
					<th>Fecha</th>
					<th>Descripción</th>
				<tr>
			</thead>
		<tbody>`;
		result.forEach((entry) => {
			content += `<tr>
				<td>${entry.Operacion}</td>
				<td>${entry.Tabla}</td>
				<td>${entry.Usuario}</td>
				<td>${entry.Fecha}</td>
				<td>${entry.Descripcion}</td>
				</tr>`;
		});
		content += "</tbody></table>";
		htmltopdf
			.generatePdf(
				{ content },
				{
					path: `./pdfs/historial ${d
						.toLocaleDateString("es")
						.replace(/\//g, "-")} ${d
						.toLocaleTimeString()
						.replace(/:/g, "-")}.pdf`,
				}
			)
			.then(() => {
				console.log(
					`Generado PDF del historial a las ${new Date().toLocaleTimeString()}`
				);
			});
	});
};
