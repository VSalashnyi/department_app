var express = require('express');
var app = express();
//  var morgan = require('morgan');


app.use(express.static('public'))
app.use(express.static('source'))


app.get('*', function(req, res) {
   res.sendFile(__dirname + '/public/index.html');
    //res.sendFile(__dirname + '/source/main.js');
});

app.listen(3001);