const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const encoder = bodyParser.urlencoded();

const app = express();
app.use("/assets",express.static("assets"));

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ms_exp1",
    port : "3306"
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});


app.get("/",function(req,res){
    res.sendFile(__dirname + "/web/index.html");
})

app.post('/register', function(req, res) {
	var email = req.body.email;
	var name = req.body.name;
	var password = req.body.password;
	if (email && name && password) {
		connection.query('INSERT INTO users(email,name,password) VALUES(?,?,?)', [email,name, password], function(error, results, fields) {
			if (connection.query == true) {
				res.redirect("/thanks");
			} else {
				res.send('');
			}			
			res.end();
		});
	} else {
		res.send('not valid!');
		res.end();
	}
})

app.post("/login",encoder, function(req,res){
    var name = req.body.name;
    var password = req.body.password;

    connection.query("SELECT * FROM users WHERE name = ? AND password = ?",[name,password],function(error,results,fields){
        if (results.length > 0) {
            res.redirect("/welcome");
        } else {
            res.redirect("/");
        }
        res.end();
    })
})

// when login is success
app.get("/welcome",function(req,res){
    res.sendFile(__dirname + "/web/index.html")
})
app.get("/thanks",function(req,res){
    res.sendFile(__dirname + "/web/login.html")
})


// set app port 
app.listen(4000);