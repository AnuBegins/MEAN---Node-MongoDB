var mongoose = require('mongoose');

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

//var User = mongoose.model('User', UserSchema);
module.exports = mongoose.model('User', UserSchema);
