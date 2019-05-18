var mongoose    = require('mongoose');

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
module.exports = mongoose.model('Quote'); // retrieving the Quote schema from our Models and storing in a variable 
