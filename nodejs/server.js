var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser()); 
app.use(express.static(__dirname + '/public'));
var connection = null;

app.get('/', function (req, res) {
    res.render("index.html");
});

function connectDatabase(success,error){
    connection = mysql.createConnection({
        host: '127.0.0.1',
		port:'3306',
        user: 'root',
        password: 'welcome01',
        database: 'rasi'
    });
    connection.connect(function (err) {
        if (err) {
            error("Error in database connection");
        } else {
            success("Database connected successfully");
        }
    });
}

app.post('/login', function (req, res) {
	connectDatabase(function(data){
		connection.query('SELECT * FROM user where username="'+req.body.username+'" and password="'+req.body.password+'"', function (err, user) {
																																
			if(user!=""){
				res.json('success');		
			}else{
				res.json('error');
			}
    	});				 
	},function(error){
		res.send(error);
	});
});



app.post('/get_customer', function (req, res) {
	connectDatabase(function(data){
    	connection.query('SELECT * FROM customer where date="'+req.body.date+'"', function (err, rows) {
        res.json(rows);
    	});
	},function(error){
		res.send(error);
	});
});

app.post('/delete_customer', function (req, res) {
	connectDatabase(function(data){
    	connection.query('DELETE FROM customer where id="'+req.body.id+'"', function (err, rows) {
        res.json(rows);
    	});
	},function(error){
		res.send(error);
	});
});

app.post('/edit_customer', function (req, res) {
	connectDatabase(function(data){
    	connection.query('SELECT * FROM customer where id="'+req.body.id+'"', function (err, rows) {
        res.json(rows);
    	});
	},function(error){
		res.send(error);
	});
});


app.post('/add_customer', function (req, res) {	
	connectDatabase(function(data){
		connection.query('INSERT INTO customer (name,gaudian,address,date_of_birth,purpose,dealer,total,advance,balance,date,phone_number) VALUES ("'+req.body.name+'","'+req.body.gaudian+'","'+req.body.address+'","'+req.body.date_of_birth+'","'+req.body.purpose+'","'+req.body.dealer+'","'+req.body.total+'","'+req.body.advance+'","'+req.body.balance+'","'+req.body.date+'","'+req.body.phone+'")',function (err, result) {
        	if (result!="") {
            	res.json("success");
        	} else {
            	res.json("error");
        	}
    	});				 
	},function(error){
		res.send();
	});
});


app.post('/update_customer', function (req, res) {		
	connectDatabase(function(data){
		connection.query('update customer set name="'+req.body.name+'", gaudian="'+req.body.gaudian+'", address="'+req.body.address+'", date_of_birth="'+req.body.date_of_birth+'", purpose="'+req.body.purpose+'", dealer="'+req.body.dealer+'", total="'+req.body.total+'", advance="'+req.body.advance+'", balance="'+req.body.balance+'", date="'+req.body.date+'", phone_number="'+req.body.phone+'" where id="'+req.body.id+'"',function (err, result) {
        	if (result!="") {
            	res.json("success");
        	} else {
            	res.json("error");
        	}
    	});				 
	},function(error){
		res.send();
	});
});

app.post('/search_customer', function (req, res) {
	connectDatabase(function(data){
    	connection.query('SELECT * FROM customer where name like "%'+req.body.key+'%" OR date like "%'+req.body.key+'%" OR dealer like "%'+req.body.key+'%"', function (err, rows) {
        res.json(rows);
    	});
	},function(error){
		res.send(error);
	});
});

app.listen(3000, function () {
    console.log('server started');
});