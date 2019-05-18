var Users = require('../controllers/usersController.js')

module.exports = (app) => {

    app.post('/register', Users.register);
    app.post('/login', Users.login);

    app.get('/', Users.index);
	app.get('/dashboard', Users.display);
    app.get('/logout', Users.logout);

}
