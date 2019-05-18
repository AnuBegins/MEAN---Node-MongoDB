var path        = require('path');

// ---------- Express ----------
var express     = require('express'); // Require the Express Module
var app         = express(); // Create an Express App
app.listen(8000, function() {
    console.log("listening on port 8000");
})

// ---------- Session ----------
var session = require('express-session');
app.use(session({
    secret: 'robotuprising',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000}
}));

// ---------- Body Parser ----------
var bodyParser  = require('body-parser'); // Require body-parser (to receive post data from clients)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Integrate body-parser with our App


// ---------- Flash ----------
const flash     = require("express-flash");
app.use(flash());

// ---------- View Engine ----------
app.set('views', path.join(__dirname, './client/views')); // Setting our Views Folder Directory
app.set('view engine', 'ejs'); // Setting our View Engine look for .ejs files

//mongoose file
require("./server/config/mongoose");

//routes
require("./server/config/routes")(app);


