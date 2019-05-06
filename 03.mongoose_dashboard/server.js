
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

app.set('views', path.join(__dirname, './views')); // Setting our Views Folder Directory
app.set('view engine', 'ejs'); // Setting our View Engine set to EJS

// ----------------- Database Server -------------------------------//
mongoose.connect('mongodb://localhost/mongoose_dashboard', { useNewUrlParser: true });
mongoose.Promise = global.Promise; // Use native promises

// -------------- SCHEMA ---------------------//
var DogSchema = new mongoose.Schema({
    name:  {
        type: String,
        required: [true, 'A name is required.'],
        minlength: 2
    },
    breed: {
        type: String,
        required: [true, 'Specify a breed.'],
        maxlength: 100
     },
     age: {
        type: Number,
        min: 1,
        max: 50
    }
    },
    {timestamps: true }
);
mongoose.model('Dog', DogSchema); // setting this Schema in our Models as 'Quote'
var Dog = mongoose.model('Dog'); // retrieving the Quote schema from our Models and storing in a variable


//------------------- ROUTES---------------------------------------------

// DISPLAY item from the database
app.get('/dogs/:id', function (request, response) {
    Dog.findById(request.params.id, function(err, dog) {
        if (err) {
            console.log("Error: couldn't retrieve info for this id");
        } else {
           var dogInfo = dog;
           response.render('show', {dog: dogInfo});
        }
    });
});

app.get('/', function(request, response) {  // Root Request
    if(!request.session.Data){
		request.session.Data = {};
    }
    Dog.find({}, function(err, dogs) {
        if (err) {
            console.log('Error retrieving all dogs');
        } else {
            var allDogs = dogs;
            response.render('index', {dogs: allDogs});
        }
    });
});


// --------------Create ------------------- //
app.post('/dogs', function(request, response) {
    console.log("POST DATA: ", request.body);
    var dog = new Dog(request.body);
    dog.save(function(err) {
        if(err) {
            console.log('There was an error: ', err);
            for(var key in err.errors){
                request.flash('registration', err.errors[key].message);
            }
            response.redirect('/');
        } else {
            console.log('Successfully added doggie');
            console.log("New doggie: ", dog);
            response.redirect('/');
        }
    });
});



// ------ UPDATE ----------- //
 app.post("/dogs/:id", function(request,response){
    Dog.findByIdAndUpdate({_id: request.params.id},request.body,{upsert:false}, function(err, dog){
        if(err){
            handleError(err);
        } else {
            response.redirect("/dogs/"+request.params.id);
        }
    });
});


// ------- DELETE item from the database -----------//
app.get('/dogs/destroy/:id', function (request, response) {
   // Dog.find({_id: request.params._id}).remove().exec(); // .exec() executes the query
    Dog.findByIdAndRemove(request.params.id, function(err) {
        response.redirect('/');
    });
});


// --------------------- WEB SERVER -------------------------- //
app.listen(8000, function() {
    console.log("listening on port 8000");
})
