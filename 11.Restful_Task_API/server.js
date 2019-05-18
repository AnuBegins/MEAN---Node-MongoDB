
const port          = 8000;
// ---------- Express ----------
const express       = require("express");
const app           = express();
app.listen(port, () => console.log(`Listening on port ${port}...`));

// ---------- Body Parser ----------
const bodyParser    = require("body-parser");
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true}));

// ---------- Mongoose ----------
require("./server/config/mongoose");

// ---------- Routes ----------
require("./server/config/routes")(app);
