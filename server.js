// Load http module.
var http = require('http');
// Load express module.
var express = require('express');

// Initialize app object.
var app = new express();

// // Use app.set to add the view engine.
// // Ass app is an express object, it has a view engine property.
// app.set('view engine', 'jade');

// // Set path to views.
// app.set('views', './views');

app.use(express.static(__dirname+'/dist/komplett-portal'));

app.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname+'/dist/komplett-portal/index.html'));
});

// Create server and listen on port 4200.
var port = process.env.PORT || 8080;

http.createServer(app).listen(port, function() {
  console.log(`Server running on port ${port}`);
});
