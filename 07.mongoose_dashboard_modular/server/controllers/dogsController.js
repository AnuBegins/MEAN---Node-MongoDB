// var flash           = require('express-flash');
// var mongoose        = require('mongoose');
// var Dog             = mongoose.model('Dog');
// mongoose.Promise    = global.Promise;

var Dog      = require('../models/dog.js')

class DogsController {
    create(request, response) {
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
                console.log('Successfully added new doggie: ', dog);
                response.redirect('/');
            }
        });
    }

    showAll(request, response) {
        Dog.find({}, function(err, dogs) {
            if (err) {
                console.log('Error retrieving all dogs');
            } else {
               // var allDogs = dogs;
                response.render('index', {allDogs: dogs});
            }
        });
    }

    show(request, response) {
        Dog.findById(request.params.id, function(err, dog) {
            if (err) {
                console.log("Error: couldn't retrieve info for this id");
            } else {
              //  var dogInfo = dog;
                response.render('show', {dog: dog});
            }
        });
    }

    update(request, response) {
        Dog.findByIdAndUpdate({_id: request.params.id},request.body,{upsert:false}, function(err, dog){
            if(err){
                handleError(err);
            } else {
                response.redirect("/dogs/"+request.params.id);
            }
        });
    }

    delete(request, response) {
    // Dog.find({_id: request.params._id}).remove().exec(); // .exec() executes the query
        Dog.findByIdAndRemove(request.params.id, function(err) {
            response.redirect('/');
        });
    }
}

module.exports = new DogsController();

