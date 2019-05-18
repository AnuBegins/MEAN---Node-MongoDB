var Quote      = require('../models/quote.js')

module.exports = {

  show: function(request, response) {
    Quote.find({}, function(err, quotes) {
        if (err) {
            console.log('Error retrieving all quotations');
        } else {
            var allQuotes = quotes;
            response.render('index', {quotes: allQuotes});
        }
      });
    },

  create: function(request, response) {
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
}
}