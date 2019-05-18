
const bcrypt    = require('bcryptjs');
var User        = require('../models/user.js')


class UsersController {

    index(request, response) {
        response.render('index');
    }

    register(request, response) {
        console.log('Post Data: ', request.body);
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
    }

    login(request, response) {
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
                    bcrypt.compare(request.body.password, user.password, function (err, result) {
                        if (result) { // Passwords match
                            console.log('--- Passwords match ---');
                            request.session.user_id = user._id;
                            response.redirect('/dashboard');
                        } else {
                            console.log('--- Passwords do not match ---');
                            request.flash('pwErrors', 'Something went wrong with your login attempt.');
                            response.redirect('/');
                        }
                    });
                }
            }
        });
    }

    display(request, response) {
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
    }

    logout(request, response) {
        request.session.destroy(function(err) {
            response.redirect('/');
        });
    }
}

module.exports = new UsersController();