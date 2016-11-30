var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mysql = require('mysql');


var app = express();
var port = process.env.PORT || 3000;

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

mysqlConnection.query('SELECT * FROM Locations ORDER BY Distance DESC', function(err, rows){
  if (err){
    console.log("Failed to sort")
  }
  else{
    var locations = [];
    rows.forEach(function(row){
      locations.push({
        location: row.Title,
        latitude: row.Latitude,
        longitude: row.Longitude,
        discription: row.Discription,
        distance: row.Distance
      })console.log("Sorted"));
      
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

// Parse all request bodies as JSON.
app.use(bodyParser.json());

// Serve static files from public/.
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function (req, res) {
  res.render('index-page', {
    pageTitle: 'Welcome!'
  });
});

app.get('*', function(req, res) {
  res.status(404).render('404-page', {
    pageTitle: '404'
  });
});

// Listen on the specified port.
app.listen(port, function () {
  console.log("== Listening on port", port);
});
