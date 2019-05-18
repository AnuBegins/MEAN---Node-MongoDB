
var mongoose  = require('mongoose');  // require mongoose
var fs        = require('fs'); // require the fs module for loading model files
var path      = require('path'); // require path for getting the models path

mongoose.connect('mongodb://localhost/quoting_dojo', { useNewUrlParser: true }); // connect to mongoose!

var models_path = path.join(__dirname, '../models'); // create a variable that points to the path where all of the models live

// read all of the files in the models_path and require (run) each of the javascript files
fs.readdirSync(models_path).forEach(function(file) {
  if(file.indexOf('.js') >= 0) {
    // require the file (this runs the model file which registers the schema)
    require(models_path + '/' + file);
  }
});