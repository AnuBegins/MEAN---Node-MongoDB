var mongoose    = require('mongoose');

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
        min: [0, 'Must be at least 0 years old'],
        max: 50
    }
    },
    {timestamps: true }
);
//mongoose.model('Dog', DogSchema); // setting this Schema in our Models as 'Dog'
module.exports = mongoose.model('Dog', DogSchema); // retrieving the Quote schema from our Models and storing in a variable
