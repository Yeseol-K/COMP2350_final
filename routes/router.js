const router = require('express').Router();
const database = include('databaseConnection');
const dbModel = include('databaseAccessLayer');
//const dbModel = include('staticData');

router.get('/', async (req, res) => {
	console.log("page hit");
	
	try {
		const result = await dbModel.getAllUsers();
		res.render('index', {allUsers: result});

		//Output the results of the query to the Heroku Logs
		console.log(result);
	}
	catch (err) {
		res.render('error', {message: 'Error reading from MySQL'});
		console.log("Error reading from mysql");
	}
});

router.post('/addUser', async (req, res) => {
	console.log("form submit");
	console.log(req.body);
	try {
	const success = await dbModel.addUser(req.body);
	if (success) {
	res.redirect("/");
	}
	else {
	res.render('error', {message: "Error writing to MySQL"});
	console.log("Error writing to MySQL");
	}
	}
	catch (err) {
	res.render('error', {message: "Error writing to MySQL"});
	console.log("Error writing to MySQL");
	console.log(err);
	}
	});

module.exports = router;
