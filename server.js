var express=require('express');
var app = express()
var http = require('http').Server(app)
var io = require('socket.io') (http)
app.use(express.static(__dirname + '/Client'));

io.on('connection', function(socket){
	console.log('user connected')
	socket.on('chat message', function(message){
		console.log(message)
		io.emit('chat message', message)
	})
	
	socket.on('disconnect', function(){
		console.log('user disconnected')
	})
	
})

http.listen(3000, function(){
	console.log('listening on *:3000') 
})

