
var express     = require('express'); // Require the Express Module
var app         = express(); // Create an Express App
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser'); // Require body-parser (to receive post data from clients)
var path        = require('path');
var session     = require("express-session");
const flash     = require("express-flash");

app.use(session({
    secret: 'robotuprising',
    saveUninitialized: true, // (default: true)
    resave: true, // (default: true)
}));
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Integrate body-parser with our App

app.set('views', path.join(__dirname, './client/views')); // Setting our Views Folder Directory
app.set('view engine', 'ejs'); // Setting our View Engine set to EJS

//mongoose file
require("./server/config/mongoose");

//routes
require("./server/config/routes")(app);


app.listen(8000, function() {
    console.log("listening on port 8000");
});
