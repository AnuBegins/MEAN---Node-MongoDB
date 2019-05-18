var path    = require("path")
const port  = 8000;

// ---------- Express ----------
const express   = require('express');
const app       = express();
app.listen(port, () => console.log(`Listening on port ${port}...`));

// ---------- Flash ----------
var flash = require("express-flash");
app.use(flash());

// ---------- Session ----------
var session = require('express-session');
app.use(session({
    secret: 'robotuprising',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 600000}
}));

// ---------- Body Parser ----------
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// ---------- View Engine ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './client/views'));

//mongoose file
require("./server/config/mongoose");

//routes
require("./server/config/routes")(app);


// var uniqueValidator = require("mongoose-unique-validator");
// UserSchema.plugin(uniqueValidator, {message: "E-mail already exists in the system"});

