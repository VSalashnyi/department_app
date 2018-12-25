var express = require('express');
var app = express();
var morgan = require('morgan');


app.use(morgan('dev'));


app.get('*', function(req, res) {
    res.sendfile(__dirname + '/public/index.html');
});

app.listen(8080);