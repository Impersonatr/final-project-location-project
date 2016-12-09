var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mysql = require('mysql');


var app = express();
var port = process.env.PORT || 3000;

//Very Secret Credentials Do Not Steal
var mysqlHost = "mysql.cs.orst.edu";
var mysqlUser = "cs290_newelln";
var mysqlPassword = "2956";
var mysqlDB = "cs290_newelln";


var mysqlConnection = mysql.createConnection({
	host: mysqlHost,
	user: mysqlUser,
	password: mysqlPassword,
	database: mysqlDB
});


mysqlConnection.connect(function(err) {
	if (err) {
		console.log("== Unable to make connection to MySQL Database.")
		throw err;
	}
});

/*
 * Set up Express to use express-handlebars as the view engine.  This means
 * that when you call res.render('page'), Express will look in `views/` for a
 * file named `page` (express-handlebars will recognize the .handlebars
 * extension), and it will use express-handlebars to render the content of that
 * file into HTML.
 *
 * Here, we're also setting express-handlebars to use 'main' as the default
 * layout.  This means that, if we can res.render('page'), express-handlebars
 * will take the content from `views/page.handlebars` and plug it into the
 * {{{body}}} placeholder in `views/layouts/main.handlebars`.
 */

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// Serve static files from public/.
app.use(express.static(path.join(__dirname, 'public')));

//index page
app.get('/', function (req, res) {
	mysqlConnection.query('SELECT * FROM Locations ORDER BY Distance ASC', function(err, rows){
		if (err) {
		  console.log("== Error fetching locations from database:", err);
		  res.status(500).send("Error fetching locations from database: " + err);
		}

		else{
			mysqlConnection.query('SELECT * FROM HomeTable', function(err, home){
				if (err) {
					console.log("== Error fetching locations from database:", err);
					res.status(500).send("Error fetching locations from database: " + err);
				}
				else {
					var locations = [];
					rows.forEach(function(row){
						locations.push({
							location: row.Title,
							latitude: row.Latitude,
							longitude: row.Longitude,
							description: row.Description,
							distance: row.Distance
						});
					});

					var homeT = [];
					home.forEach(function(home) {
						homeT.push ({
							location: home.Title,
							latitude: home.Latitude,
							longitude: home.Longitude
						});
					});
					res.render('index-page', {
						pageTitle: 'Beaver Locatorator',
						Locations: locations,
						Home: homeT
					});
				}
			});
		}
	});
});

//reset page, now useless basically? Clears all values from table with distance value of 0
app.get('/reset', function(req, res) {
	mysqlConnection.query('DELETE FROM Locations WHERE Distance = "0"', function(err){
		if (err) {console.log("== Error deleting locations from database:", err);}
		res.status(200).send();
	});
});

//404 page, catches all other URLs
app.get('*', function(req, res) {
	res.status(404).render('404-page', {
		pageTitle: '404'
	});
});

//Listen on the specified port.
app.listen(port, function () {
	console.log("== Listening on port", port);
});

//listen for a POST to the URL /add-place, and if valid, store the data
app.post('/add-place', function (req, res, next) {
	if (req.body && req.body.title) {
		mysqlConnection.query('SELECT * FROM HomeTable', function(err, home){
			if (err) {console.log("== Error getting Home!:", err);}
			else {
				var homeT = [];
				home.forEach(function(home) {
					homeT.push ({
						location: home.Title,
						latitude: home.Latitude,
						longitude: home.Longitude
					});
				});

				//calculate the distance!
				var distance = getDistance(homeT[0].latitude, homeT[0].longitude, req.body);

				mysqlConnection.query('INSERT INTO Locations (Title, Latitude, Longitude, Description, Distance) VALUES (?, ?, ?, ?, ?)',
				[req.body.title, req.body.latitude, req.body.longitude, req.body.description, distance], function (err, result) {
					if (err) {
						console.log("== Error inserting Locations from database:", err);
						res.status(500).send("Error inserting new location into database: " + err);
					}
				});
			}
		});
	}
});


app.post('/remove-place', function (req, res, next) {
	if(req.body) {
		mysqlConnection.query('DELETE FROM Locations WHERE Latitude = ? AND Longitude = ?',
		[req.body.latitude, req.body.longitude], function(err){
			if (err) {
				console.log("== Error deleting location from database:", err);
				res.status(500).send("Error deleting location: " + err);
			}
			else{res.status(200).send();}
		});
	}


});

app.post('/update-home', function (req, res, next) {
	if(req.body) {
		mysqlConnection.query('TRUNCATE TABLE HomeTable', function(err) {
			if(err) {
				console.log("== Error removing old Home:", err);
				res.status(500).send("Error removing old Home: " + err);
			}
			else {
				mysqlConnection.query('INSERT INTO HomeTable (Latitude, Longitude) VALUES (?, ?)',
				[req.body.latitude, req.body.longitude], function (err, result) {
					if (err) {
						console.log("== Error inserting Locations from database:", err);
						res.status(500).send("Error inserting new location into database: " + err);
					}
					else{
						mysqlConnection.query('SELECT Latitude, Longitude, Distance FROM Locations', function(err, loc){
							if (err) {
								console.log("== Error inserting Locations from database:", err);
								res.status(500).send("Error inserting new location into database: " + err);
							}
							else {
								var locations = [];
								loc.forEach(function(loc){
									locations.push({
										latitude: loc.Latitude,
										longitude: loc.Longitude,
										distance: loc.Distance
									});
								});
								var i, newDist;
								for(i=0; i<locations.length; i++) {
									newDist = getDistance(req.body.latitude, req.body.longitude, locations[i]);
									mysqlConnection.query('UPDATE Locations SET Distance = ? WHERE Distance = ?',
									[newDist, loc[i].Distance], function(err){
										if(err) {
											console.log("== Error updating distances:", err);
											res.status(500).send("Error updating distances: " + err);
										}
									});
								}
								res.status(200).send();
							}
						});




					}
				});
			}
		});
	}
});

//The following function calculates the distance between our coordinates
function getDistance(lati, longi, newRow){
	var lat1 = lati;
	var lat2 = newRow.latitude;
	var long1 = longi;
	var long2 = newRow.longitude;
	var deltaLat;
	var deltaLong;

	var R = 3961; //this is the radius of the Earth in miles
	deltaLat = lat2 - lat1;
	deltaLong = long2 - long1;

	var x = Math.pow(Math.sin(deltaLat * Math.PI / 180.0), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLong * Math.PI / 180.0), 2);
	var y = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
	var dist = R * y;

	return dist;
}
