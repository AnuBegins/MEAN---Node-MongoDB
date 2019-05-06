
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
app.use(express.static(path.join(__dirname, './static')));  // Setting our Static Folder Directory

app.set('views', path.join(__dirname, './views')); // Setting our Views Folder Directory
app.set('view engine', 'ejs'); // Setting our View Engine set to EJS

// This is how we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of
//   our db in mongodb -- this should match the name of the db you are going to use for your project.
mongoose.connect('mongodb://localhost/basic_mongoose', { useNewUrlParser: true });
mongoose.Promise = global.Promise; // Use native promises

var UserSchema = new mongoose.Schema({
    first_name:  {
        type: String,
        required: [true, 'First Name is required'],
        minlength: 2
    },
    last_name: {
        type: String,
        required: [true, 'Last Name is required'],
        maxlength: 50
     },
    age: {
        type: Number,
        min: 1,
        max: 150
    },
    email: {
        type: String,
        required: [true, 'A valid e-mail address is required'],
    }
    },
    {timestamps: true }
);
mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'User'
var User = mongoose.model('User'); // We are retrieving this Schema from our Models, named 'User'


//------------------- ROUTES---------------------------------------------
app.get('/', function(request, response) {  // Root Request
    if(!request.session.Data){
		request.session.Data = {};
	}
    User.find({}, function(err, users) {
        if (err) {
            console.log('Error retrieving all users');
        } else {
            var allUsers = users;
         //   console.log(allUsers);
            response.render('index', {users: allUsers});
        }
    });
});

app.post('/users', function(request, response) { // Add User Request
    console.log("POST DATA: ", request.body);
    
    var user = new User(request.body);
    user.save(function(err) {
        if(err) {
            console.log('There was an error: ', err);
            for(var key in err.errors){
                request.flash('registration', err.errors[key].message);
            }
            response.redirect('/');
        } else {
            console.log('Successfully added user');
            console.log("New user: ", user);
            response.redirect('/');
        }
    });
});

// -------------- WEB SERVER ------------------------//
app.listen(8000, function() {
    console.log("listening on port 8000");
})
