var express = require('express');
var fs = require('fs');
var fileName = "index.html";

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  var text = fs.readFileSync(fileName, 'utf-8');
  var buffer = new Buffer(text);
  response.send(buffer.toString('utf-8'));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});