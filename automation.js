const htmltopdf = require("html-pdf-node");
const CronJob = require("cron").CronJob;

module.exports = (connection) => {
	const pdfHistorial = new CronJob(
		"0 */2 * * * *",
		() => {
			generatePDF(connection);
		},
		null,
		true,
		"America/Mexico_City"
	);
};

const generatePDF = (connection) => {
	connection.query("SELECT * FROM log_historial", (error, result) => {
		if (error) {
			return error;
		}
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
						.replace(/\//g, "-")} ${d.toLocaleTimeString()}.pdf`,
				}
			)
			.then(() => {
				console.log(
					`Generado PDF del historial a las ${new Date().toLocaleTimeString()}`
				);
			});
	});
};
