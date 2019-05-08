var path = require("path")

// ---------- Express ----------
const express   = require('express');
const app       = express();
const server    = app.listen(8000);
console.log("Running at port 8000...");

// ---------- Flash ----------
var flash       = require("express-flash");
app.use(flash());

// ---------- Session ----------
const session     = require('express-session');
app.set('trust proxy',1)
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
app.set('views', path.join(__dirname, './views'));


// ---------- Bcrypt ----------
const bcrypt = require('bcryptjs');

// ---------- Mongoose ----------
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/login_reg', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise;

var uniqueValidator = require("mongoose-unique-validator");

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
};

var birthdayVal = function(birthday) {
    var diff = Date.now() - birthday.getTime();
    var age = new Date(diff);
    var final = Math.abs(age.getUTCFullYear() - 1970);
    if (final < 13) {
        return false;
    }
    else {
        return true;
    }
}

var UserSchema = new mongoose.Schema({ // JS object that defines the schema (blueprint)
    email: {
        type: String,
        required: [true, 'A valid e-mail is required'],
        validate: [validateEmail, "Not a valid email address"],
        unique: true
    },
    first_name: {
        type: String,
        required: [true, 'First name is required'],
        min: [2, 'First name must be at least 2 letters long']
    },
    last_name: {
        type: String,
        required: [true, 'Last name is required'],
        min: [2, 'Last name must be at least 2 letters long']
    },
    password: {
        type: String,
        required: true,
        min: [5, 'Password must contain at least 5 characters'],
    },
    birthday: {
        type: Date,
        required: [true, 'Please enter a date of birth'],
        validate: [birthdayVal, "You must be at least 13 years old to register"]
    }
    },
    {timestamps: true}
);

mongoose.model('User', UserSchema)
var User = mongoose.model('User');
UserSchema.plugin(uniqueValidator, {message: "E-mail already exists in the system"});

// ---------- Routing ----------

app.get('/', function (request, response) {
    response.render('index');
});

// User registers for an account
app.post('/register', function (request, response) {
    console.log("Post Data : ", request.body);
    bcrypt.hash(request.body.password, 10, function(err, hash){ // hash user's password
        var user = new User({
            email:      request.body.email,
            first_name: request.body.first_name,
            last_name:  request.body.last_name,
            password:   hash,
            birthday:   request.body.bday
        });
        User.find({email: user.email}, function (err, users) {
            if (users.length) { // if we have an occurence of that email in our database
                console.log(users)
                console.log('--- User already exists--- ');
                response.redirect('/');
            } else {
                user.save(function (err) {
                    if (err) {
                        console.log('--- Errors! ---');
                        console.log(user);
                        for (var key in err.errors) {
                            request.flash('registration', err.errors[key].message);
                        }
                        response.redirect('/');
                    } else {
                        console.log('--- Added a new user to the database: ---');
                        console.log(user);
                        request.session.user_id = user._id;
                        console.log('REQ.SESSION. = ', request.session.user_id);
                        response.redirect('/dashboard');
                    }
                });
            }
        });
    });
});

// Process user's login credentials.
app.post('/login', function (request, response) {
    console.log('--- Login post request ---');
    if (!request.body.name  || !request.body.password){
        request.flash('pwErrors', 'Fields cannot be left blank.');
    }
    User.findOne({email: request.body.email}, function (err, user) { // Check if email is tied to an account.
        if (!user) { // No match for email in db.
            console.log('--- User does not exist.---');
            console.log(request.body);
            response.redirect('/');
        } else { // Email has a match/user exists
            console.log('--- Email exists in DB. ---');
            console.log(user);
            if (user){
                // bcrypt.compare(request.body.password, user.password, function (err, result) {
                //     if (result) { // Passwords match
                //         console.log('--- Passwords match ---');
                //         request.session.user_id = user._id;
                //         response.redirect('/dashboard');
                //     } else {
                //         console.log('--- Passwords do not match ---');
                //         request.flash('pwErrors', 'Something went wrong with your login attempt.');
                //         response.redirect('/');
                //     }
                // });
                bcrypt.compare(request.body.password, user.password)
                .then(result => {
                    console.log('--- Passwords match ---');
                    request.session.user_id = user._id;
                    response.redirect('/dashboard');
                })
                .catch(error => {
                    console.log('--- Passwords do not match ---');
                    request.flash('pwErrors', 'Something went wrong with your login attempt.');
                    response.redirect('/');
                });
                }
            }
        }
    );
});

// Route logged-in users to the dashboard.
app.get('/dashboard', function (request, response) {
    if (request.session.user_id) {
        User.find({
            _id: request.session.user_id
        }, function (err, user) {
            console.log(user);
            if (err) {
                console.log('--- Could not find user. ---');
            } else {
                console.log('--- Found the user. ---');
                user = user;
                response.render('dashboard', {user: user});
            }
        });
    } else {
        console.log('User is not logged in and tried to access /dash');
        response.redirect('/');
    }
});

app.get('/logout', function(request, response){
    request.session.destroy(function(err) {
        response.redirect('/');
    });
});