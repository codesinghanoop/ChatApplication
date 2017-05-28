var express=require('express');
var app = express()
var http = require('http').Server(app)
var io = require('socket.io') (http)
var ip = require('ip');
app.use(express.static(__dirname + '/Client'));

require("./controller/controller.js")(app,io);

http.listen(3000, function(){
	console.log('listening on *:3000') 
})

