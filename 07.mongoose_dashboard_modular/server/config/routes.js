var Dogs = require('../controllers/dogsController.js')

module.exports = (app) => {

    app.post('/dogs', Dogs.create);
    app.post('/dogs/:id', Dogs.update);

	app.get('/', Dogs.showAll);
    app.get('/dogs/:id', Dogs.show);

    app.get('/dogs/destroy/:id', Dogs.delete);

}

