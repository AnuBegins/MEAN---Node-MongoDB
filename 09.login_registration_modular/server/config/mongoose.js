
var mongoose    = require('mongoose');
mongoose.connect('mongodb://localhost/login_reg', { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;

var path        = require('path'); // require path for getting the models path
var models_path = path.join(__dirname, '../models'); // create a variable that points to the path where all of the models live

var fs        = require('fs'); // require the fs module for loading model files
// read all of the files in the models_path and require (run) each of the javascript files
fs.readdirSync(models_path).forEach(function(file) {
  if(file.indexOf('.js') >= 0) {
    // require the file (this runs the model file which registers the schema)
    require(models_path + '/' + file);
  }
});