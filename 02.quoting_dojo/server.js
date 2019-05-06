
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

mongoose.connect('mongodb://localhost/quoting_dojo', { useNewUrlParser: true });
mongoose.Promise = global.Promise; // Use native promises

var QuoteSchema = new mongoose.Schema({
    source:  {
        type: String,
        required: [true, 'A source is required.'],
        minlength: 2
    },
    quote: {
        type: String,
        required: [true, 'A damn quote is required.'],
        maxlength: 1000
     },
    },
    {timestamps: true }
);
mongoose.model('Quote', QuoteSchema); // setting this Schema in our Models as 'Quote'
var Quote = mongoose.model('Quote'); // retrieving the Quote schema from our Models and storing in a variable 


//------------------- ROUTES---------------------------------------------
app.get('/', function(request, response) {  // Root Request
    if(!request.session.Data){
		request.session.Data = {};
    }
    Quote.find({}, function(err, quotes) {
        if (err) {
            console.log('Error retrieving all quotations');
        } else {
            var allQuotes = quotes;
            response.render('index', {quotes: allQuotes});
        }
    });
    // response.render('index', {});
});

app.post('/quotes', function(request, response) { 
    console.log("POST DATA: ", request.body);
    var quote = new Quote(request.body);
    quote.save(function(err) {
        if(err) {
            console.log('There was an error: ', err);
            for(var key in err.errors){
                request.flash('registration', err.errors[key].message);
            }
            response.redirect('/');
        } else {
            console.log('Successfully added quotation');
            console.log("New quotation: ", quote);
            response.redirect('/');
        }
    });
});

// app.get('/quotes', function(request, reqsponse) {
//     Quote.find({}, function(err, quotes) {
//         if (err) {
//             console.log('Error retrieving all quotations');
//         } else {
//             var allQuotes = quotes;
//             response.render('quotes', {quotes: allQuotes});
//         }
//     });
// });

app.listen(8000, function() {
    console.log("listening on port 8000");
})
