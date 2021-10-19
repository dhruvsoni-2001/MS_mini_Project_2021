var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');


var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	database : 'ms_exp1',
    port     : '3306'
});

var app = express();
app.use(express.static("web"));
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname + '/web/index.html'));
});


app.post('/register', function(request, response) {
	var email = request.body.email;
	var name = request.body.name;
	var password = request.body.password;
	if (email && name && password) {
		connection.query('INSERT INTO `users`(`email`,`name`,`password`) VALUES(?,?,?)', [email,name, password], function(error, results, fields) {
			if (connection.query == true) {
				response.redirect(__dirname+'/web/index.html');
			} else {
				response.send('');
			}			
			response.end();
		});
	} else {
		response.send('not valid!');
		response.end();
	}
});

app.post('/login', function(request, response) {
	var name = request.body.name;
	var password = request.body.password;
	if (name && password) {
		connection.query('SELECT * FROM users WHERE name = ? AND password = ?', [name, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.name = name;
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		// response.(__dirname +'./web/index.html', request.session.name );
		window.location.href="/web/index.html";
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

connection.connect(function(err){
	if(!err){
		console.log("Connected!");
	}
	else{
		console.log("error while connecting with database")
	}
})

app.listen(3000);