var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);



app.use(express.static(__dirname + '/public'));  
app.get('*', function(req, res,next) {  
    res.sendFile(__dirname + '/public/views/index.html');
});

server.listen(8080);

io.on('connection', function(client) {  
    console.log('Client connected...');

    client.on('join', function(data) {
        console.log(data);
    });

});