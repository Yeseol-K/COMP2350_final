//Define the include function for absolute file name
global.base_dir = __dirname;
global.abs_path = function(path) {
	return base_dir + path;
}
global.include = function(file) {
	return require(abs_path('/' + file));
}


const express = require('express');
const database = include('databaseConnection');
const router = include('routes/router');

const port = process.env.PORT || 3000;

async function printMySQLVersion() {
	let sqlQuery = `
		SHOW VARIABLES LIKE 'version';
	`;
	
	try {
		const results = await database.query(sqlQuery);
		console.log("Successfully connected to MySQL");
		console.log(results[0]);
		return true;
	}
	catch(err) {
		console.log("Error getting version from MySQL");
		return false;
	}
}

const success = printMySQLVersion();


const app = express();
app.set('view engine', 'ejs');

app.use('/',router);
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({extended: false}));

app.listen(port, () => {
	console.log("Node application listening on port "+port);
}); 



