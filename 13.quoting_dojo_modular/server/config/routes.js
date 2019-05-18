
var quotes      = require('../controllers/quotesController.js')

module.exports = (app) => {
	app.get('/', quotes.show);

	app.post('/quotes', quotes.create);

}

